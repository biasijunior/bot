import parse from 'csv-parse/lib/sync'
import {existsSync, promises} from 'fs'

import selectors from '../utils/selectors'
import observer from '../utils/observer'
import camelize from '../utils/camelize'
import config from '../utils/config'

const getText = async (page, selector) => await page.$eval(selector, e => e.textContent)

const update = async (action, card) => {
    await page.waitForSelector('#card_number')
    await page.$eval('#card_number', (e, arg) => e.value = arg, card)

    await page.click(selectors.buttons.filter)
    await page.waitForSelector('.sorting_1')
    const status = await getText(page, '#dt_card_by_card tbody tr td:nth-child(8)')

    if (new RegExp(action.slice(0, 2), 'gi').test(status)) {
        console.log({card, status})
        return false
    }

    await page.click('.btn.btn-dark.btn-xs')
    await page.click('.card-by-card-' + action.toLowerCase())

    await page.waitForSelector('.swal2-confirm', {visible: true})
    await page.click('.swal2-confirm')
    return true
}

const receiptRepo = {
    get: async () => {
        await page.goto(config.baseUrl + '/nrfacore/public/cards/card')

        await page.waitForSelector('select#distributor')

        await page.evaluate(arg => $(`#distributor option:contains(${arg})`)[0].selected = true, config.distributor)

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
    },
    edit: async ({action, cards}) => {
        await page.goto(config.baseUrl + '/nrfacore/public/cards/card')

        const data = {action, cards: []}
        for (const card of cards) {
            const resp = await update(action, card)
            if (resp) data.cards.push(card)
        }
        return data
    }
}

export default receiptRepo