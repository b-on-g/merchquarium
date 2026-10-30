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
npx mam bog/merchquarium/app bog/merchquarium/seo/run
rsync -a --delete --exclude '.baza' --exclude '*.map' --exclude '*test*' bog/merchquarium/app/- bog/merchquarium/seo/run/dist
rsync -a --exclude '.baza' --exclude '*.map' bog/merchquarium/seo/run/-/ bog/merchquarium/seo/run/dist
```

## Запуск рядом с Базой (caddy-docker-proxy)

На сервере в папке с `Dockerfile`, `docker-compose.yml` и `dist`:

```
echo NKA_DOMAIN=cmyser-ru-merchquarium.91.188.212.151.ip.giper.dev >> .env
docker compose up -d --build
```

Старый адрес `cmyser-ru-nka…` caddy постоянно перенаправляет на новый.

Коды подтверждения Search Console и Яндекс Вебмастера (способ «мета-тег») кладутся в `.env` рядом с compose: `NKA_GOOGLE=…`, `NKA_YANDEX=…`. Узел вставит их в `<head>` главной и страниц каталогов.

После запуска прописать адрес в `bog/merchquarium/app/app.view.tree`: `seo_server \https://<NKA_DOMAIN>/`.

## Автовыкладка

Каждый пуш в `main` после сборки отправляет `dist` на сервер шагом «Deploy SEO server» в `.github/workflows/deploy.yml`. На сервере его принимает `~/nka/deploy.sh`: распаковывает архив во временную папку, проверяет, что все файлы на месте, подменяет `dist` и перезапускает контейнер.

CI заходит отдельным ключом из секрета `SEO_SSH_KEY`. В `~/.ssh/authorized_keys` он записан с `restrict,command="/home/user/nka/deploy.sh"`, поэтому умеет только выкладывать. Без секрета шаг пропускается.

## Локально

```
cd bog/merchquarium/app/-
node ../../seo/run/-/node.js port=9095
```

Запускать из папки с `web.baza`: из неё узел берёт список мастеров.
