import puppeteer from 'puppeteer'

import config from '../utils/config'
import login from './login'

const pattern = 'distributor\\/index|nrfacore\\/public\\/home\\/merchant|flot\\.bundle|das\\.obf|fullcalendar|selectmoment|smartwizard|chart|sparkline|vendors\\.bundle|data\\.js|default|jquery\\.js|export'
const sa = '|sweetalert2|blockUI|bootstrap'

export default async (callback, args = {}) => {
    global.browser = await puppeteer.launch(config.browser)
    global.page = await browser.newPage()
    global.start = Date.now()

    await page.setViewport(config.viewport)
    await page.setDefaultNavigationTimeout(0)

    const regex = new RegExp(pattern + (args.cards ? '' : sa), 'gi')

    await page.setRequestInterception(true)
    page.on('request', request => {
        // if (/script|js/gi.test(request.resourceType()) && !REGEX.test(request.url()))
        //     console.log(request.resourceType(), request.url())

        if (request.resourceType().match(/image|stylesheet|font|other/) || request.url().match(regex))
            request.abort()
        else
            request.continue()
    })

    await page.goto(config.baseUrl)

    await login()
    const data = await callback(args)
    await browser.close()
    return data
}