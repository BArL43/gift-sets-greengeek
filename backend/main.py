import asyncio
import html
import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_IDS = [
    chat_id.strip()
    for chat_id in os.getenv("TELEGRAM_CHAT_IDS", os.getenv("TELEGRAM_CHAT_ID", "")).split(",")
    if chat_id.strip()
]
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app = FastAPI(title="Gift Sets API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Gift Sets API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


async def send_telegram_message(message: str):
    """Send a message to every configured Telegram recipient."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_IDS:
        raise HTTPException(status_code=500, detail="Telegram config missing")

    async with httpx.AsyncClient(timeout=10.0) as client:
        for chat_id in TELEGRAM_CHAT_IDS:
            response = await client.post(
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
                json={"chat_id": chat_id, "text": message, "parse_mode": "HTML"},
            )
            if response.status_code != 200:
                raise HTTPException(status_code=502, detail="Telegram delivery failed")


class OrderItem(BaseModel):
    title: str = "Товар"
    quantity: int = Field(default=1, ge=1)
    price: float = Field(ge=0)
    composition: str = ""


class Order(BaseModel):
    name: str
    phone: str
    address: str
    telegram: str = ""
    comments: str = ""
    items: list[OrderItem] = Field(min_length=1)
    total_amount: float = Field(ge=0)
    promo_code: str = ""


PROMO_CODE = "HELLOGREEN"
PROMO_DISCOUNT_PERCENT = 15
PROMO_MAX_USES = int(os.getenv("PROMO_MAX_USES", "10"))
DELIVERY_COST_RUB = 120.0
promo_usage_count = 0
promo_lock = asyncio.Lock()


class PromoRequest(BaseModel):
    items: list[OrderItem] = Field(min_length=1)
    promo_code: str


def calculate_items_total(items: list[OrderItem]) -> float:
    return round(sum(item.price * item.quantity for item in items), 2)


def safe(value: Any) -> str:
    return html.escape(str(value), quote=True)


@app.post("/promo/validate")
async def validate_promo(promo: PromoRequest):
    original_total = calculate_items_total(promo.items)
    code = promo.promo_code.strip().upper()

    if code != PROMO_CODE:
        return {
            "valid": False,
            "message": "Неверный промокод",
            "original_total": original_total,
        }

    async with promo_lock:
        exhausted = promo_usage_count >= PROMO_MAX_USES
    if exhausted:
        return {
            "valid": False,
            "message": "Промокод больше недоступен (лимит исчерпан)",
            "original_total": original_total,
        }

    discount = round(original_total * (PROMO_DISCOUNT_PERCENT / 100), 2)
    discounted_total = round(original_total - discount, 2)
    return {
        "valid": True,
        "message": "Промокод применен",
        "percent": PROMO_DISCOUNT_PERCENT,
        "original_total": original_total,
        "discount": discount,
        "discounted_total": discounted_total,
    }


@app.post("/orders/")
async def create_order(order: Order):
    global promo_usage_count

    calculated_total = calculate_items_total(order.items)
    applied_discount = 0.0
    applied_promo = ""

    if order.promo_code:
        if order.promo_code.strip().upper() != PROMO_CODE:
            raise HTTPException(status_code=400, detail="Неверный промокод")
        applied_discount = round(calculated_total * (PROMO_DISCOUNT_PERCENT / 100), 2)
        applied_promo = PROMO_CODE

    final_total = round(calculated_total - applied_discount + DELIVERY_COST_RUB, 2)
    if abs(order.total_amount - final_total) > 0.01:
        raise HTTPException(
            status_code=400,
            detail="Итоговая сумма заказа не совпадает с серверным расчетом",
        )

    items_str = "\n".join(
        f"• {safe(item.title)} x{item.quantity} — {item.price * item.quantity:.2f}₽"
        + (f"\n  <i>Состав: {safe(item.composition)}</i>" if item.composition else "")
        for item in order.items
    )
    message = (
        f"🛒 <b>Новый заказ!</b>\n\n"
        f"<b>Имя:</b> {safe(order.name)}\n"
        f"<b>Телефон:</b> {safe(order.phone)}\n"
        f"<b>Адрес:</b> {safe(order.address)}\n"
        f"<b>Telegram:</b> {safe(order.telegram)}\n"
        f"<b>Комментарий:</b> {safe(order.comments)}\n\n"
        f"<b>Товары:</b>\n{items_str}\n\n"
        + (f"<b>Промокод:</b> {safe(applied_promo)} (-{PROMO_DISCOUNT_PERCENT}%)\n" if applied_promo else "")
        + (f"<b>Скидка:</b> -{applied_discount:.2f}₽\n" if applied_discount else "")
        + f"<b>Доставка:</b> {DELIVERY_COST_RUB:.2f}₽\n"
        + f"<b>Итого:</b> {final_total:.2f}₽"
    )

    if applied_promo:
        async with promo_lock:
            if promo_usage_count >= PROMO_MAX_USES:
                raise HTTPException(
                    status_code=400,
                    detail="Промокод больше недоступен (лимит исчерпан)",
                )
            await send_telegram_message(message)
            promo_usage_count += 1
    else:
        await send_telegram_message(message)

    return {
        "ok": True,
        "message": "Order sent to Telegram",
        "items_total": calculated_total,
        "delivery_cost": DELIVERY_COST_RUB,
        "total_amount": final_total,
        "discount": applied_discount,
        "promo_applied": bool(applied_promo),
    }


class Contact(BaseModel):
    name: str
    email: str
    message: str


@app.post("/contact/")
async def create_contact(contact: Contact):
    message = (
        f"📧 <b>Новое сообщение с сайта!</b>\n\n"
        f"<b>Имя:</b> {safe(contact.name)}\n"
        f"<b>Email:</b> {safe(contact.email)}\n"
        f"<b>Сообщение:</b>\n{safe(contact.message)}"
    )

    await send_telegram_message(message)
    return {"ok": True, "message": "Contact message sent to Telegram"}


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host=host, port=port)
