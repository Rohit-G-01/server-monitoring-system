FROM alpine:latest

RUN apk add --no-cache bash curl procps

COPY agent.sh /agent.sh
RUN chmod +x /agent.sh

CMD ["/agent.sh"]