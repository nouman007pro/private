FROM node:20

RUN apt-get update && apt-get install -y \
python3 \
python3-pip \
ffmpeg

RUN pip install yt-dlp

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

CMD ["node","server.js"]
