# GreenGeek Gift Sets

Учебный full-stack проект сервиса подарочных наборов: каталог, оформление заказа и backend-интеграция с Telegram.

> Это ранний учебный проект. Он не является основным Go-проектом в моём портфолио, но показывает полный цикл разработки небольшого веб-приложения — frontend, API и внешнюю интеграцию.

## Tech stack

- React frontend
- Python / FastAPI backend
- Pydantic
- httpx
- Telegram Bot API

## Backend features

- `GET /health` — healthcheck;
- `POST /promo/validate` — проверка промокода и расчёт скидки;
- `POST /orders/` — проверка итоговой суммы на стороне сервера и отправка заказа в Telegram;
- `POST /contact/` — отправка сообщения с формы обратной связи;
- конфигурация Telegram recipients и CORS через environment variables.

## Structure

```text
backend/     # FastAPI service
frontend/    # React client
```

## Backend run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp env.example .env
python main.py
```

Конфигурация хранится в environment variables. Реальные Telegram token/chat IDs не должны коммититься в репозиторий.

## Context

Проект выполнен как учебная full-stack работа и сохранён в профиле как пример ранней практики разработки продукта целиком. Для Go/backend-портфолио основными репозиториями являются `org-structure-api` и `delivery-service`.
