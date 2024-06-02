'use strict';

const os = require('os');
const axios = require('axios').default;
const schedule = require('node-schedule');
const constants = require('./constants');

let qBittorrentEndpoint;
let qBittorrentUsername;
let qBittorrentPassword;
let cron;

process.on('SIGINT', async () => {
    console.info('Shutting down');
    await schedule.gracefulShutdown();
    await logout();
    process.exit(0);
});

async function main() {
    try {
        init();
        await login();

        console.info(`Creating the schedule job with cron ${cron}`);
        schedule.scheduleJob(cron, performUpdateDefaultTracker);
    } catch (error) {
        console.error(error.message);
    }
}

function init() {
    qBittorrentEndpoint = process.env[constants.environmentVariables.endpoint];
    qBittorrentUsername = process.env[constants.environmentVariables.username];
    qBittorrentPassword = process.env[constants.environmentVariables.password];

    if (!qBittorrentEndpoint || !qBittorrentUsername || !qBittorrentPassword) {
        throw new Error('Invalid configuration: endpoint or username or password is not specified.');
    }

    cron = process.env[constants.environmentVariables.cron] || constants.defaults.hourlyCron;

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.timeout = 5000;
}

async function login() {
    console.info('Logging in');
    const response = await axios.post(
        `${qBittorrentEndpoint}${constants.api.login}`,
        {
            'username': qBittorrentUsername,
            'password': qBittorrentPassword,
        }
    );

    const sid = response.headers['set-cookie']
        .filter(cookie => cookie.includes('SID'))
        .map(sidCookie => sidCookie.split(';')[0].trim())[0];

    console.info('Setting SID cookie');
    axios.defaults.headers.common['Cookie'] = `${sid}`;
}

async function logout() {
    await axios.post(
        `${qBittorrentEndpoint}${constants.api.logout}`,
    );
    console.info('Logged out');
}

async function performUpdateDefaultTracker() {
    try {
        const trackerList = await downloadTrackerList();
        await setDefaultTrackers(trackerList);
    } catch (error) {
        console.error(error.message);
    }
}

async function downloadTrackerList() {
    console.info('Downloading trackers list');
    const trackerListUrl = process.env[constants.environmentVariables.trackerList] || constants.defaults.trackerList;
    const response = await axios.get(trackerListUrl);
    const trackers = response.data;
    return trackers.split(os.EOL).filter(line => line).join(',');
}

async function setDefaultTrackers(defaultTrackers) {
    console.info('Updating default trackers');

    await axios.post(
        `${qBittorrentEndpoint}${constants.api.setPreferences}`,
        {
            json: `{"add_trackers_enabled": true, "add_trackers": "${defaultTrackers}"}`
        }
    )
}

main().then();
