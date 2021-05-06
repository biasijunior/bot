require('dotenv').config()

export default {
    username: process.env.LOGIN_ID,
    password: process.env.PASSWORD,
    viewport: {width: 1480, height: 0, deviceScaleFactor:2},
    browser: {
        args: ['--disable-gpu', '--single-process', '--no-zygote', '--no-sandbox', '--hide-scrollbars', '--disable-setuid-sandbox'],
        headless: process.env.NODE_ENV === 'production',
        ignoreDefaultArgs: ['--disable-extensions'],
        executablePath: '/usr/bin/chromium-browser',
        ignoreHTTPSErrors: true
    },
    baseUrl: process.env.BASE_URL,
    url: {
        callback: process.env.CALLBACK_URL,
        block_callback: process.env.BLOCK_CARD_CALLBACK_URL
    },
    distributor: process.env.DISTRIBUTOR
}