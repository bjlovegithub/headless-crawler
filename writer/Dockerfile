FROM node:carbon
ADD ./writer /writer
WORKDIR /writer
COPY ./package.json /writer
RUN npm install
CMD ["node", "mongodb_writer.js"]