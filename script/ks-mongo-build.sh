#!/bin/bash
# @edu how to build customized mongodb with init database
docker build -t samcn26/ks-mongo . -f -<<EOF
FROM mongo
ENV MONGO_INITDB_DATABASE ks-system
COPY ./script/mongo-init.js /docker-entrypoint-initdb.d/
EOF