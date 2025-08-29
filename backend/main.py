import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID') 
ADDITIONAL_CHAT_ID = "7615776686"  # Дополнительный получатель

app = FastAPI(title="Gift Sets API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    """Отправляет сообщение всем получателям"""
    if not TELEGRAM_BOT_TOKEN:
        raise HTTPException(status_code=500, detail="Telegram config missing")
    
    chat_ids = [TELEGRAM_CHAT_ID, ADDITIONAL_CHAT_ID]
    if not TELEGRAM_CHAT_ID:
        chat_ids = [ADDITIONAL_CHAT_ID]
    
    async with httpx.AsyncClient() as client:
        for chat_id in chat_ids:
            if chat_id:
                resp = await client.post(
                    f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
                    json={
                        "chat_id": chat_id,
                        "text": message,
                        "parse_mode": "HTML"
                    }
                )
                if resp.status_code != 200:
                    print(f"Failed to send message to {chat_id}: {resp.text}")

class Order(BaseModel):
    name: str
    phone: str
    address: str
    telegram: str = ''
    comments: str = ''
    items: list
    total_amount: float
    promo_code: str = ''

# Promo configuration (simple in-memory tracking)
PROMO_CODE = "HELLOGREEN"
PROMO_DISCOUNT_PERCENT = 15
PROMO_MAX_USES = int(os.getenv("PROMO_MAX_USES", "10"))
promo_usage_count = 0

class PromoRequest(BaseModel):
    items: list
    promo_code: str

@app.post("/promo/validate")
async def validate_promo(promo: PromoRequest):
    # Compute original total
    try:
        original_total = sum([
            float(item.get('price', 0)) * int(item.get('quantity', 1)) for item in promo.items
        ])
    except Exception:
        raise HTTPException(status_code=400, detail="Некорректные товары в запросе")

    code = (promo.promo_code or '').strip().upper()
    if code != PROMO_CODE:
        return {
            "valid": False,
            "message": "Неверный промокод",
            "original_total": round(original_total, 2),
        }
    if promo_usage_count >= PROMO_MAX_USES:
        return {
            "valid": False,
            "message": "Промокод больше недоступен (лимит исчерпан)",
            "original_total": round(original_total, 2),
        }

    discount = round(original_total * (PROMO_DISCOUNT_PERCENT / 100), 2)
    discounted_total = round(original_total - discount, 2)
    return {
        "valid": True,
        "message": "Промокод применен",
        "percent": PROMO_DISCOUNT_PERCENT,
        "original_total": round(original_total, 2),
        "discount": discount,
        "discounted_total": discounted_total,
    }

@app.post("/orders/")
async def create_order(order: Order):
    global promo_usage_count
    # Calculate raw total from items to prevent client tampering
    calculated_total = 0.0
    try:
        calculated_total = sum([
            float(item.get('price', 0)) * int(item.get('quantity', 1)) for item in order.items
        ])
    except Exception:
        raise HTTPException(status_code=400, detail="Некорректные товары в заказе")

    applied_discount = 0.0
    applied_promo = ''

    if order.promo_code:
        if order.promo_code.strip().upper() != PROMO_CODE:
            raise HTTPException(status_code=400, detail="Неверный промокод")
        if promo_usage_count >= PROMO_MAX_USES:
            raise HTTPException(status_code=400, detail="Промокод больше недоступен (лимит исчерпан)")
        applied_discount = round(calculated_total * (PROMO_DISCOUNT_PERCENT / 100), 2)
        applied_promo = PROMO_CODE
        promo_usage_count += 1

    final_total = round(calculated_total - applied_discount, 2)
    items_str = '\n'.join([
        f"• {item.get('title', 'Товар')} x{item.get('quantity', 1)} — {item.get('price', 0)*item.get('quantity', 1)}₽"
        + (f"\n  <i>Состав: {item.get('composition', 'Не указан')}</i>" if item.get('composition') else "")
        for item in order.items
    ])
    message = (
        f"🛒 <b>Новый заказ!</b>\n\n"
        f"<b>Имя:</b> {order.name}\n"
        f"<b>Телефон:</b> {order.phone}\n"
        f"<b>Адрес:</b> {order.address}\n"
        f"<b>Telegram:</b> {order.telegram}\n"
        f"<b>Комментарий:</b> {order.comments}\n\n"
        f"<b>Товары:</b>\n{items_str}\n\n"
        + (f"<b>Промокод:</b> {applied_promo} (-{PROMO_DISCOUNT_PERCENT}%)\n" if applied_promo else "")
        + (f"<b>Скидка:</b> -{applied_discount}₽\n" if applied_discount else "")
        + (f"<b>Итого (с учетом скидки):</b> {final_total}₽" if applied_discount else f"<b>Итого:</b> {final_total}₽")
    )
    
    await send_telegram_message(message)
    return {"ok": True, "message": "Order sent to Telegram", "total_amount": final_total, "discount": applied_discount, "promo_applied": bool(applied_promo)}

class Contact(BaseModel):
    name: str
    email: str
    message: str

@app.post("/contact/")
async def create_contact(contact: Contact):
    message = (
        f"📧 <b>Новое сообщение с сайта!</b>\n\n"
        f"<b>Имя:</b> {contact.name}\n"
        f"<b>Email:</b> {contact.email}\n"
        f"<b>Сообщение:</b>\n{contact.message}"
    )
    
    await send_telegram_message(message)
    return {"ok": True, "message": "Contact message sent to Telegram"}

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port) 
