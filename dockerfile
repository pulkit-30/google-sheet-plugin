FROM node:16-alpine3.17
WORKDIR /app/
COPY ../package.json ../yarn.lock ./
RUN yarn
COPY ../ .
EXPOSE 8080
CMD [ "yarn", "start" ]