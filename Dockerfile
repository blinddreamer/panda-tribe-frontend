FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=meh /usr/src/app/build /usr/share/nginx/html
EXPOSE 82
CMD ["nginx", "-g", "daemon off;"]
