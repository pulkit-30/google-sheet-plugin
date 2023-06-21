FROM node:16
WORKDIR /app/
COPY ../package.json ../yarn.lock ./
RUN yarn
COPY ../ .
EXPOSE 8080
CMD [ "yarn", "start" ]