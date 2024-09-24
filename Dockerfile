FROM node:16

RUN apt-get update && apt-get install -y tesseract-ocr

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
