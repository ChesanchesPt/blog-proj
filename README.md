# Блог

Веб-приложение для публикации постов и обсуждений. Пользователи могут зарегистрироваться, войти в аккаунт, создавать и редактировать посты, оставлять комментарии и голосовать за посты и комментарии. В интерфейсе также есть страницы профилей и список недавно открытых постов.

## Технологии и структура

- `frontend/` — React, TypeScript, Vite и Tailwind CSS. Страницы находятся в `src/pages/`, компоненты — в `src/components/`, запросы к API — в `src/api/`.
- `backend/` — Express, TypeScript, Prisma и PostgreSQL. Маршруты находятся в `src/routes/`, обработчики — в `src/controllers/`, схема и миграции БД — в `prisma/`.
- `docker-compose.yml` — конфигурация PostgreSQL и сервисов приложения; `k8s/` и `scripts/` содержат файлы для развёртывания.

## Локальный запуск

Понадобятся Node.js, npm и Docker с Compose для базы данных. Выполняйте команды из корня репозитория.

1. Создайте корневой файл `.env` с параметрами PostgreSQL и секретом токенов:

   ```dotenv
   POSTGRES_USER=bloguser
   POSTGRES_PASSWORD=change-me
   POSTGRES_DB=blogdb
   JWT_SECRET=replace-with-a-long-random-secret
   ```

2. Запустите базу данных:

   ```sh
   docker compose up -d db
   ```

3. Создайте `backend/.env` по образцу `backend/.env.example`. Для API, запущенного вне контейнера, укажите адрес базы `localhost`:

   ```dotenv
   PORT=3000
   DATABASE_URL=postgresql://bloguser:change-me@localhost:5432/blogdb
   JWT_SECRET=replace-with-a-long-random-secret
   ```

   Значения пользователя, пароля, базы и секрета должны совпадать с корневым `.env`. Затем установите зависимости, создайте Prisma Client, примените миграции и запустите API:

   ```sh
   cd backend
   npm ci
   npx prisma generate
   npm run migrate
   npm run dev
   ```

4. В другом терминале запустите клиент:

   ```sh
   cd frontend
   npm ci
   npm run dev
   ```

Откройте `http://localhost:5173`. API работает на `http://localhost:3000`; его доступность можно проверить по `GET /health`. По умолчанию клиент обращается к `http://localhost:3000`. Для другого адреса задайте `VITE_API_URL` в `frontend/.env` (образец — `frontend/.env.example`). Файлы `.env` не следует добавлять в Git.

## Основные маршруты API

| Метод и путь | Назначение |
| --- | --- |
| `POST /auth/register`, `POST /auth/login` | Регистрация и вход |
| `GET /posts`, `GET /posts/:id` | Список и просмотр поста |
| `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id` | Изменение постов |
| `GET /posts/:postId/comments`, `POST /comments` | Просмотр и создание комментариев |
| `POST /posts/:id/upvote`, `POST /posts/:id/downvote` | Голосование за пост |
| `POST /comments/:id/upvote`, `POST /comments/:id/downvote` | Голосование за комментарий |

Для создания и изменения контента, а также голосования нужен заголовок `Authorization: Bearer <token>`. Токен возвращается при регистрации и входе.

## Проверка и сборка

Во `frontend/` выполните `npm run lint` для проверки ESLint и `npm run build` для проверки типов и сборки клиента. В `backend/` выполните `npm run build` для компиляции API; собранный сервер запускается командой `npm start`. Автоматизированные тесты и требования к покрытию пока не настроены.
