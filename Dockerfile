FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY slask-cms/package*.json ./slask-cms/
RUN npm ci
COPY tsconfig.json ./
COPY slask-cms ./slask-cms
COPY src ./src
RUN ls -l
RUN npm run build -w slask-cms
RUN npm run build
CMD ["node","dist/index.js"]