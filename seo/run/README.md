# SEO-сервер каталогов

Узел Гипер Базы, который отдаёт приложение каталога и готовый HTML каждого каталога для поисковиков.

- `/?catalog=<link>` — страница каталога: название, товары, цены, обложки, мета-теги, JSON-LD. Браузер поверх неё запускает обычное приложение.
- `/sitemap.xml` — все известные открытые каталоги, кроме скрытых владелицей.
- `/robots.txt`
- `POST /register` с телом `<link>` — сообщить серверу о каталоге. Приложение делает это само, если задан `seo_server`.

Известные каталоги сервер держит в постоянной подписке, поэтому страницы всегда отражают текущие данные ленда.

## Сборка

Из корня MAM:

```
npx mam bog/nka/app bog/nka/seo/run
```

## Запуск рядом с Базой (caddy-docker-proxy)

```
echo NKA_DOMAIN=cmyser-ru-nka.91.188.212.151.ip.giper.dev >> /etc/environment
docker compose -f bog/nka/seo/run/docker-compose.yml up -d --build
```

После запуска прописать адрес в `bog/nka/app/app.view.tree`: `seo_server \https://<NKA_DOMAIN>/`.

## Локально

```
cd bog/nka/app/-
node ../../seo/run/-/node.js port=9095
```

Запускать из папки с `web.baza`: из неё узел берёт список мастеров.
