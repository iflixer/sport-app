FROM alpine as front

WORKDIR /app
COPY . .

RUN sed -i 's/v3.football.api-sports.io/api.flashscore.ai/g' ./front/js/soccer.js