const environmentVariables = {
    endpoint: 'QBITTORRENT_ENDPOINT',
    username: 'QBITTORRENT_USERNAME',
    password: 'QBITTORRENT_PASSWORD',
    trackerList: 'QBITTORRENT_TRACKER_LIST',
    cron: 'CRON',
};

const api = {
    login: '/api/v2/auth/login',
    logout: '/api/v2/auth/logout',
    setPreferences: '/api/v2/app/setPreferences'
}

const defaults = {
    trackerList: 'https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt',
    dailyCron: '0 0 * * *',
}

module.exports = {
    environmentVariables,
    api,
    defaults
}
