FROM ghcr.io/puppeteer/puppeteer:21.7.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci
COPY . .
CMD ["node", "index.js"]