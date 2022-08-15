# douban-api-node
It's the server side of a JellyFin Plugin called [jellyfin-plugin-opendouban](https://github.com/caryyu/jellyfin-plugin-opendouban "jellyfin-plugin-opendouban") by using NodeJS.

It's inspired by the flowing projects
- [douban-openapi-server](https://github.com/caryyu/douban-openapi-server "douban-openapi-server") written with python.
- [douban](https://github.com/deepsearun/douban "douban")

## 1. How to run
### 1. NodeJS
```bash
npm install
node index.js
```
### 2. Docker
```bash
docker build . -t xxxx/douan-api-node
docker run -p 6501:6501 -d --name douan-api xxxx/douan-api-node
```

## 2. What to use
### 1. Server Side of Jellyfin Plugin
### 2. a Simple API





