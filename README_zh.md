qBittorrent Tracker Auto Add
--
[English](README.md)

定时更新qBittorrent中自动添加到新torrent的tracker。

![GitHub License](https://img.shields.io/github/license/boris1993/qbittorrent-tracker-auto-add)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/boris1993/qbittorrent-tracker-auto-add/build.yml)
![Docker Pulls](https://img.shields.io/docker/pulls/boris1993/qbittorrent-tracker-auto-add)
![Docker Image Version](https://img.shields.io/docker/v/boris1993/qbittorrent-tracker-auto-add)
![Docker Image Size](https://img.shields.io/docker/image-size/boris1993/qbittorrent-tracker-auto-add)

## 用法
如果访问Docker Hub有困难，那么你也可以使用托管在阿里云的镜像`registry.cn-hangzhou.aliyuncs.com/boris1993/qbittorrent-tracker-auto-add`。

### Docker
```shell
docker run -d dock\
  -e QBITTORRENT_ENDPOINT=http://localhost:8080 \
  -e QBITTORRENT_USERNAME=admin \
  -e QBITTORRENT_PASSWORD=password \
  --restart always \
  --name qbittorrent-tracker-auto-add \
  boris1993/qbittorrent-tracker-auto-add:latest
```

### Docker Compose
```yaml
version: '3'

services:
  qbittorrent-tracker-auto-add:
    image: boris1993/qbittorrent-tracker-auto-add:latest
    container_name: qbittorrent-tracker-auto-add
    restart: always
    environment:
      QBITTORRENT_ENDPOINT: 'http://127.0.0.1:8080'
      QBITTORRENT_USERNAME: admin
      QBITTORRENT_PASSWORD: password
```

### 可选环境变量参数

- `TZ` - 指定容器中的时区。默认为UTC。
- `CRON` - 以`crontab`格式指定更新频率。默认每天00:00运行一次 (`0 * * * *`)。
- `QBITTORRENT_TRACKER_LIST` - 指定要下载的tracker列表。默认下载[ngosang/trackerslist提供的trackers_best.txt](https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt)。
- `all_proxy` - 指定HTTP代理来解决因为网络质量导致的tracker列表下载失败的问题。

## 许可协议
该软件依[MIT](LICENSE)协议开放源代码。
