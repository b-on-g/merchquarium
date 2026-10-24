# SEO-сервер каталогов

Узел Гипер Базы, который отдаёт приложение каталога и готовый HTML каждого каталога для поисковиков.

- `/?catalog=<link>` — страница каталога: название, товары, цены, обложки, мета-теги, JSON-LD. Браузер поверх неё запускает обычное приложение.
- `/sitemap.xml` — все известные открытые каталоги, кроме скрытых владелицей.
- `/robots.txt`
- `POST /register` с телом `<link>` — сообщить серверу о каталоге. Приложение делает это само, если задан `seo_server`.

Известные каталоги сервер держит в постоянной подписке, поэтому страницы всегда отражают текущие данные ленда.

## Сборка

Из корня MAM собрать приложение и сервер, затем сложить их в `dist` рядом с `Dockerfile`: сначала бандл приложения, поверх него бандл сервера (его `node.js` и `package.json` главнее).

```
npx mam bog/prilavok/app bog/prilavok/seo/run
rsync -a --delete --exclude '.baza' --exclude '*.map' --exclude '*test*' bog/prilavok/app/- bog/prilavok/seo/run/dist
rsync -a --exclude '.baza' --exclude '*.map' bog/prilavok/seo/run/-/ bog/prilavok/seo/run/dist
```

## Запуск рядом с Базой (caddy-docker-proxy)

На сервере в папке с `Dockerfile`, `docker-compose.yml` и `dist`:

```
echo NKA_DOMAIN=cmyser-ru-nka.91.188.212.151.ip.giper.dev | sudo tee -a /etc/environment
docker compose up -d --build
```

Коды подтверждения Search Console и Яндекс Вебмастера (способ «мета-тег») кладутся в `.env` рядом с compose: `NKA_GOOGLE=…`, `NKA_YANDEX=…`. Узел вставит их в `<head>` главной и страниц каталогов.

После запуска прописать адрес в `bog/prilavok/app/app.view.tree`: `seo_server \https://<NKA_DOMAIN>/`.

## Локально

```
cd bog/prilavok/app/-
node ../../seo/run/-/node.js port=9095
```

Запускать из папки с `web.baza`: из неё узел берёт список мастеров.
