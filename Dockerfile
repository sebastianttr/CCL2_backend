FROM node:16
COPY . /
RUN npm install
EXPOSE 80 3000
CMD ["npm","run","start"]