FROM node:17-alpine

WORKDIR /app/server

RUN npm install -g nodemon

COPY . .

RUN npm install

EXPOSE 3000

# CMD [ "ls" ]
CMD [ "npm", "start" ]