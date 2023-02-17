FROM node:19-bullseye-slim
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm i
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
COPY --chown=node:node app.js app.js
USER node
CMD ["dumb-init", "npm","start"]
# I am using two copy commands, in order to cache separately the npm i 