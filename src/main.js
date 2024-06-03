'use strict';

const os = require('os');
const axios = require('axios').default;
const {AxiosError} = require("axios");
const axiosRetry = require('axios-retry').default;
const {Cookie} = require('tough-cookie');
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

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition(error) {
        return 400 <= error.response.status && error.response.status <= 599;
    },
    onRetry: async (retryCount, error, _) => {
        if (error.response.status === 403) {
            console.info('SID cookie invalid. Re-logging in.');
            await login();
        }
    },
});

async function main() {
    init();
    await login();

    console.info(`Creating the schedule job with cron ${cron}`);
    schedule.scheduleJob(cron, performUpdateDefaultTracker);
}

function init() {
    qBittorrentEndpoint = process.env[constants.environmentVariables.endpoint];
    qBittorrentUsername = process.env[constants.environmentVariables.username];
    qBittorrentPassword = process.env[constants.environmentVariables.password];

    if (!qBittorrentEndpoint || !qBittorrentUsername || !qBittorrentPassword) {
        throw new Error('Invalid configuration: endpoint or username or password is not specified.');
    }

    cron = process.env[constants.environmentVariables.cron] || constants.defaults.dailyCron;

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

    const sidCookieValue = response.headers['set-cookie'].filter(cookie => cookie.includes('SID'))[0];
    if (!sidCookieValue) {
        throw new Error('Cookie SID not found');
    }

    let cookie = Cookie.parse(sidCookieValue);
    console.debug(`SID=${cookie.value}`);

    console.info('Setting SID cookie');
    axios.defaults.headers.common['Cookie'] = `${cookie.key}=${cookie.value}`;
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
        if (error instanceof AxiosError) {
            console.error(`Axios error ${error.code} occurred when calling ${error.request.path}`);
        } else {
            console.error(error.message);
        }
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
