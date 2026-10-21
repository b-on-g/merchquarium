FROM node:24-alpine
COPY bog/nka/app/- /nka
COPY bog/nka/seo/run/- /nka
WORKDIR /nka
RUN [ "npm", "install" ]
ENTRYPOINT [ "node", "node.js", "port=9095" ]
