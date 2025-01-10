FROM node:18-alpine
WORKDIR /usr/src/app.ts
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]