FROM node:20-alpine

WORKDIR /interpreter

COPY . .

RUN npm ci --prod

CMD ["node", "index.js", "-f", "/var/rinha/source.rinha.json"]