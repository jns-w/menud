FROM golang:1.22-alpine3.19
WORKDIR /app
COPY go.mod .
RUN go mod download
COPY . .
RUN go build -o /app/main .
CMD ["/app/main"]