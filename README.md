# GreenGeek Gift Sets

Учебный full-stack проект сервиса подарочных наборов. Это ранняя работа, сохранённая в портфолио как пример полного пользовательского сценария: каталог, конструктор набора, локальная корзина, промокод, оформление заказа и форма обратной связи.

Основной backend-профиль в моём GitHub представлен Go-проектами `org-structure-api` и `delivery-service`. GreenGeek показывает более ранний этап разработки и работу сразу с frontend, API и внешней интеграцией.

## Поддерживаемый сценарий

1. Пользователь выбирает готовый набор или собирает свой.
2. Корзина хранится локально в браузере.
3. Backend проверяет промокод и пересчитывает стоимость товаров.
4. При оформлении заказа backend заново рассчитывает итоговую сумму на основе состава заказа и отправляет данные в Telegram.
5. Форма обратной связи также отправляет сообщение через backend, поэтому Telegram Bot token не попадает во frontend.

Старые экспериментальные auth/admin/wishlist-модули удалены: текущий репозиторий показывает только тот функционал, который поддерживается существующим backend.

## Стек

- Frontend: React, TypeScript, Material UI, React Router, Axios
- Backend: Python, FastAPI, Pydantic, httpx
- Integration: Telegram Bot API

## Backend API

- `GET /health` - healthcheck;
- `POST /promo/validate` - серверная проверка промокода и расчёт скидки;
- `POST /orders/` - валидация состава заказа, серверный пересчёт суммы и отправка заказа в Telegram;
- `POST /contact/` - отправка сообщения с формы обратной связи.

Пользовательские строки экранируются перед отправкой сообщений с Telegram `parse_mode=HTML`, а цена и количество товаров валидируются backend-моделями.

## Локальный запуск

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp env.example .env
python main.py
```

Frontend:

```bash
cd frontend
npm ci
cp .env.example .env
npm start
```

По умолчанию React dev server работает на `http://localhost:3000`, backend - на `http://localhost:8000`. `frontend/.env.example` задаёт локальный API URL через `REACT_APP_API_URL`.

## Конфигурация

Backend настраивается через environment variables:

- `TELEGRAM_BOT_TOKEN`;
- `TELEGRAM_CHAT_IDS`;
- `ALLOWED_ORIGINS`;
- `PROMO_MAX_USES`;
- `HOST`, `PORT`.

Во frontend backend URL задаётся через `REACT_APP_API_URL`. Если переменная не задана, используется URL ранее развёрнутого Render backend.

Реальные Telegram credentials не должны коммититься в репозиторий.

## Ограничения учебной версии

Лимит использования промокода хранится в памяти процесса и сбрасывается после перезапуска. Это намеренное ограничение раннего учебного проекта, а не имитация persistent production-хранилища. Для реального сервиса такой счётчик должен храниться транзакционно в базе данных.

## Проверки

В репозитории добавлен GitHub Actions workflow для проверки Python backend и сборки React frontend. На текущем репозитории GitHub пока не создаёт workflow runs после push, поэтому наличие workflow-файла не считаю подтверждением успешного CI-прогона.
