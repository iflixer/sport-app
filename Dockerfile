FROM alpine:3.20 AS front

WORKDIR /app
COPY . .

RUN sed -i 's/v3.football.api-sports.io/api-sport.printhouse.casa/g' ./js/soccer.js \
 && sed -i 's/api.flashscore.ai/api-sport.printhouse.casa/g' ./js/soccer.js \
 && sed -i 's/api.flashscore.ai/api-sport.printhouse.casa/g' ./js/app.js


FROM caddy:2-alpine

# куда кладём статику
WORKDIR /srv

# копируем готовые файлы
COPY --from=front /app /srv

# простой Caddyfile: раздаём статику
COPY <<'CADDYFILE' /etc/caddy/Caddyfile
:80 {
	root * /srv
    try_files {path} /index.html
	file_server
}
CADDYFILE

EXPOSE 80