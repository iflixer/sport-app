FROM alpine as front

WORKDIR /app
COPY . .

RUN sed -i 's/v3.football.api-sports.io/api-sport.printhouse.casa/g' ./js/soccer.js
RUN sed -i 's/api.flashscore.ai/api-sport.printhouse.casa/g' ./js/soccer.js
RUN sed -i 's/api.flashscore.ai/api-sport.printhouse.casa/g' ./js/app.js
