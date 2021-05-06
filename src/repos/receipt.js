import parse from 'csv-parse/lib/sync'
import {existsSync, promises} from 'fs'

import selectors from '../utils/selectors'
import camelize from '../utils/camelize'
import observer from '../utils/observer'
import config from '../utils/config'
import dates from '../utils/dates'

const receiptRepo = async () => {
    await page.goto(config.baseUrl + '/nrfacore/public/transactions/toll-card-collections')
    await page.waitForSelector('select#distributor')

    await page.evaluate(arg => $(`#distributor option:contains(${arg})`)[0].selected = true, config.distributor)

    const today = dates.nDaysToday()
    const yesterday = dates.nDaysToday(1)

    await page.$eval(selectors.dates.start, (el, yesterday) =>
        el.value = yesterday, yesterday)

    await page.$eval(selectors.dates.end, (el, today) =>
        el.value = today, today)

    await page.click(selectors.buttons.filter)

    await page.waitForSelector('td.sorting_1', {timeout: 0})

    if (existsSync(downloadPath)) {
        await promises.rmdir(downloadPath, {recursive: true})
    }

    await promises.mkdir(downloadPath)

    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath})
    await page.click('button.buttons-csv')

    const filePath = await observer()
    console.log({filePath})
    const content = await promises.readFile(filePath.replace('.crdownload', ''))
    const data = parse(content, {columns: true})
    return data.map(doc => camelize(doc))
}

export default receiptRepo