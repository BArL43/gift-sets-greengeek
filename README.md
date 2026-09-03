# GreenGeek Gift Sets

Учебный full-stack проект сервиса подарочных наборов. Это ранняя работа, сохранённая в портфолио как пример полного пользовательского сценария: каталог, конструктор набора, локальная корзина, промокод, оформление заказа и форма обратной связи.

Основной backend-профиль в моём GitHub представлен Go-проектами `org-structure-api` и `delivery-service`. GreenGeek показывает более ранний этап разработки и работу сразу с frontend, API и внешней интеграцией.

## Поддерживаемый сценарий

1. Пользователь выбирает готовый набор или собирает свой.
2. Корзина хранится локально в браузере.
3. Backend проверяет промокод и пересчитывает стоимость переданных позиций.
4. При оформлении backend повторно считает скидку и фиксированную доставку 120 ₽, затем сверяет итог с `total_amount` из запроса.
5. После успешной проверки заказ отправляется в Telegram.
6. Форма обратной связи также проходит через backend, поэтому Telegram Bot token не попадает во frontend.

Старые экспериментальные auth/admin/wishlist-модули удалены: текущий репозиторий показывает только тот функционал, который поддерживается существующим backend.

## Стек

- Frontend: React, TypeScript, Material UI, React Router, Axios
- Backend: Python, FastAPI, Pydantic, httpx
- Integration: Telegram Bot API
- Tests: pytest, FastAPI TestClient

## Backend API

- `GET /health` - healthcheck;
- `POST /promo/validate` - серверная проверка промокода и расчёт скидки;
- `POST /orders/` - валидация позиций, повторный расчёт скидки/доставки, проверка итоговой суммы и отправка заказа в Telegram;
- `POST /contact/` - отправка сообщения с формы обратной связи.

Количество и цена позиций валидируются как неотрицательные/положительные значения, а пользовательские строки экранируются перед отправкой сообщений с Telegram `parse_mode=HTML`.

## Локальный запуск

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp env.example .env
pytest -q
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

## Тесты

Backend-тесты проверяют:

- healthcheck;
- расчёт скидки;
- отказ для некорректного количества;
- отказ при несовпадении присланной итоговой суммы с серверным расчётом;
- серверный расчёт доставки/скидки и HTML-экранирование Telegram-сообщения.

Текущий тестовый набор отдельно прогнан локально после cleanup: `5 passed`.

## Ограничения учебной версии

Лимит использования промокода хранится в памяти процесса и сбрасывается после перезапуска. При нескольких worker-процессах счётчик также не является общим. Для реального сервиса это состояние должно храниться транзакционно в базе данных.

Цены позиций пока приходят в заказе от frontend. Backend пересчитывает сумму и не доверяет готовому `total_amount`, но без серверного каталога не может независимо подтвердить цену каждой позиции. В production-варианте заказ должен содержать идентификаторы товаров, а актуальные цены должны читаться из БД на backend.

## CI

В репозитории есть GitHub Actions workflow: он устанавливает зависимости, компилирует Python-код, запускает pytest и собирает React frontend.

После добавления workflow GitHub в этом старом репозитории пока не создаёт workflow runs на push, поэтому сам факт наличия `.github/workflows/ci.yml` не считаю подтверждением зелёного удалённого CI. Backend-тесты проверены локально; frontend после cleanup пока остаётся без подтверждённого remote CI-run.
