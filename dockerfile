FROM node:20.11.0
WORKDIR /app
RUN npm install -g nodemon
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]