# Edu_KS-System
## Introduction

I wrote this project from 0 to 1, this is a `Full Stack` plus `DevOps` project. I have marked some tips by @edu, you can search it globally.

## What can you learn from this project?

### In the design stage

- UX

    You can use the prototype tool https://www.axure.com/ to open the design file from `ux` folder.

- API

    You can use online editor https://editor.swagger.io/ to refer the API file which is based on `OpenAPI 3.0` from `apidoc` folder.

    If you're using vscode, the `swagger viewer` extension is recommended.

    After installation `click apidoc/*.yml` -> `Alt + Shift + P`

### Backend

- NodeJS
    - Express
    - JWT Authentication
        - http://www.passportjs.org/
    - DB
        - MongoDB
        - Frame: Mongoose

### Frontend

- Vue 
    - Vuex
    - Vue Router
- Axios
- Element-UI

### Test

- Jest
- ESlint

### DevOps

- Nginx
- Docker
    - Dockerfile
    - Docker compose
- CI/CD concept

## How to start the project

- Assume you have installed docker and docker-compose

```bash
# under the project folder
docker-compose up -d
docker ps

# if you got errors
# docker ps -a | grep ks-system
# docker logs <container name>

# stop services
# docker-compose stop
```

- go to http://localhost:9999 via the browser

- initial login data

    ```
    username: admin password: admin (admin)
    username: developer password: developer (normal)
    ```
