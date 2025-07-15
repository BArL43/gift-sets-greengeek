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

@app.post("/orders/")
async def create_order(order: Order):
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
        f"<b>Итого:</b> {order.total_amount}₽"
    )
    
    await send_telegram_message(message)
    return {"ok": True, "message": "Order sent to Telegram"}

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