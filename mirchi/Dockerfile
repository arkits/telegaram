FROM wcsiu/tdlib:1.7-buster

RUN apt-get --allow-releaseinfo-change update
RUN apt-get install -y \
    apt-transport-https \ 
    curl \
    gnupg

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

WORKDIR /home/mirchi
COPY mirchi .

RUN rm -rf node_modules
RUN npm install

ENTRYPOINT [ "npm start" ]