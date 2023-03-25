FROM node:17-alpine

WORKDIR /app/frontend

COPY . .

RUN npm install

EXPOSE 3000

# CMD [ "ls" ]
CMD [ "yarn", "start" ]