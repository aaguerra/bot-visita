#FROM node:10.16.0-alpine
FROM ubuntu:18.04

ENV PORT=4000
ENV MicrosoftAppId=1912766e-2fa2-4d53-9086-d2d6fc8f3d2e
ENV MicrosoftAppPassword=PAoEG4CO0Adzao&eM7SUh}+v+T
ENV LuisAppId=8a7d117d-cbb0-40a7-a782-5fab86d56e8a
ENV LuisAPIKey=1fe92e9056394489a58ba1d9098497fd
ENV LuisAPIHostName=westus.api.cognitive.microsoft.com

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_10.x | bash && \
    apt-get install -y git nodejs build-essential

RUN  apt-get install wget && \
    apt-get install -y software-properties-common && \
    wget  -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    add-apt-repository universe && \
    apt-get install apt-transport-https -y && \
    apt-get update && \
    apt-get install dotnet-sdk-2.2 -y

RUN dotnet tool install -g LUISGen

RUN npm install -g node-gyp && \
    npm install -g typescript

#RUN npm install -g chatdown msbot ludown luis-apis qnamaker botdispatch luisgen
RUN npm install -g yo generator-botbuilder

# install dependencies
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install
RUN echo "127.0.0.1 localhost" >> /etc/hosts
# copy app source to image _after_ npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . /opt/app

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects
ENV PORT 4000
#ENV PORT 61813

EXPOSE 4000
#EXPOSE 4000



CMD [ "npm", "run", "start" ]
