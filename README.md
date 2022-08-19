# douban-api-node
It's the server side of a JellyFin Plugin called [jellyfin-plugin-opendouban](https://github.com/caryyu/jellyfin-plugin-opendouban "jellyfin-plugin-opendouban") by using NodeJS.

It's inspired by the flowing projects
- [douban-openapi-server](https://github.com/caryyu/douban-openapi-server "douban-openapi-server") written with python.
- [douban](https://github.com/deepsearun/douban "douban")

## 1. How to run
### NodeJS
```bash
npm install
node index.js
```
### Docker
#### build
```bash
docker build . -t xxxx/douan-api-node
docker run -p 6501:6501 -d --name douan-api xxxx/douan-api-node
```
#### run
```bash
docker run -p 6501:6501 -d --name douan-api wander555/douan-api-node
```

## 2. What to use
### Server Side of Jellyfin Plugin
### a Simple API





