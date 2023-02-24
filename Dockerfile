FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY slask-cms/package*.json ./slask-cms/
RUN npm i
COPY tsconfig.json ./
COPY slask-cms ./slask-cms
COPY src ./src
RUN ls -l
RUN npm run build -w slask-cms

CMD ["npm", "run","server"]