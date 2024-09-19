FROM node:18.18.0

WORKDIR '/api'

COPY package.json package-lock.json ./

RUN npm install

COPY ./ ./

EXPOSE 5000

CMD ["forever", "run", "index.js"]
