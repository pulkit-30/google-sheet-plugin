### Setup Google-sheet plugin locally

##### Pre-Requistic

1. install node:16.14.0 locally.
2. have mongodb dameon up and running at port 27017.
3. have redis running at port 6379.

##### Follow these steps

1. Install Node Modules- Run `yarn` inside root folder

2. Start App by running `yarn start`

##### Add env file in root folder with these keys

Also, add value for requied fields

```
GOOGLE_APP_CLIENT_SECRET=
AUTH_SECRET=
GOOGLE_APP_REDIRECT_URL=http://localhost:1337/v1/callback/oauth/google
MONGO_URI=mongodb://localhost:27017/google-sheet-plugin
CLINET_REDIRECT=http://localhost:3000/user/organization/form
GOOGLE_APP_CLIENT_ID=
FORM_CONNECT_SECRET=
FORM_CONNECT_SERVER_URL=http://localhost:1337
```
