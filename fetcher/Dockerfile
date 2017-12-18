FROM node:carbon
ADD ./fetcher /fetcher
WORKDIR /fetcher
COPY ./package.json /fetcher
RUN npm install
CMD ["node", "fetcher_runner.js"]