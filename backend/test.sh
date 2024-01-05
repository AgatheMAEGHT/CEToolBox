#!/bin/sh

export $(cat .env | xargs) && grc go test ./tests/... -v -count=1 $@
