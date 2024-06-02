qBittorrent Tracker Auto Add
--
Automatically update the list of trackers that will be added to new torrents in qBittorrent.

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/boris1993/qbittorrent-tracker-auto-add/build.yml)
![Docker Pulls](https://img.shields.io/docker/pulls/boris1993/qbittorrent-tracker-auto-add)

## Usage
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
---
version: '3'

services:
  qbittorrent-tracker-add:
    image: boris1993/qbittorrent-tracker-auto-add:latest
    container_name: qbittorrent-tracker-auto-add
    restart: always
    environment:
      QBITTORRENT_ENDPOINT: http://localhost:8080
      QBITTORRENT_USERNAME: admin
      QBITTORRENT_PASSWORD: password
```

### Optional Parameters

- `TZ` - Specify the timezone in the container. Default is UTC.
- `CRON` - Specify the run schedule in the crontab format. Default is hourly (`0 * * * *`). 
- `QBITTORRENT_TRACKER_LIST` - Specify the tracker list to be downloaded. Default is [the best trackers from ngosang/trackerslist](https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt).
- `http_proxy` - Specify the HTTP proxy if you have difficulty downloading the tracker list.


## License
Licensed under [MIT](LICENSE) license.
