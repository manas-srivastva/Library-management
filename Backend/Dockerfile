FROM node:22-alpine

RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["npm","start"]