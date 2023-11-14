FROM golang:1.20-alpine

EXPOSE 8080

RUN apk add --no-cache gcc musl-dev
RUN go install github.com/cespare/reflex@latest
ADD . /go/src/CEToolBox/api
WORKDIR /go/src/CEToolBox/api
RUN go mod vendor && go mod tidy
RUN go install
CMD /go/bin/CEToolBox/api