qBittorrent Tracker Auto Add
--
[中文](README_zh.md)

Automatically update the list of trackers that will be added to new torrents in qBittorrent.

![GitHub License](https://img.shields.io/github/license/boris1993/qbittorrent-tracker-auto-add)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/boris1993/qbittorrent-tracker-auto-add/build.yml)
![Docker Pulls](https://img.shields.io/docker/pulls/boris1993/qbittorrent-tracker-auto-add)
![Docker Image Version](https://img.shields.io/docker/v/boris1993/qbittorrent-tracker-auto-add)
![Docker Image Size](https://img.shields.io/docker/image-size/boris1993/qbittorrent-tracker-auto-add)

## Usage
You can also download from Aliyun with image `registry.cn-hangzhou.aliyuncs.com/boris1993/qbittorrent-tracker-auto-add`
if you have difficulty accessing to Docker Hub.

### Docker
```shell
docker run \
  -e QBITTORRENT_ENDPOINT=http://localhost:8080 \
  -e QBITTORRENT_USERNAME=admin \
  -e QBITTORRENT_PASSWORD=password \
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

### Optional Parameters

- `TZ` - Specify the timezone in the container. Default is UTC.
- `CRON` - Specify the run schedule in the crontab format. Default is daily on 00:00 (`0 0 * * *`). 
- `QBITTORRENT_TRACKER_LIST` - Specify the tracker list to be downloaded. Default is [the best trackers from ngosang/trackerslist](https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt).
- `all_proxy` - Specify the HTTP proxy if you have difficulty downloading the tracker list.


## License
Licensed under [MIT](LICENSE) license.
