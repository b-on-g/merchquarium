FROM node:24-alpine
COPY dist /nka
WORKDIR /nka
RUN [ "npm", "install" ]
ENTRYPOINT [ "node", "node.js", "port=9095" ]
