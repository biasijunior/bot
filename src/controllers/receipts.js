import axios from 'axios'

import receiptRepo from '../repos/receipt'
import config from '../utils/config'
import launch from '../repos/launch'
import mem from '../utils/mem'

export default {
    get: async (req, res, next) => {
        try {
            res.send('Transaction started.')
            const data = await launch(receiptRepo)

            let i, j, docs, chunk = 1000;
            for (i = 0, j = data.length; i < j; i += chunk) {
                docs = data.slice(i, i + chunk);
                console.log(`Posting: ${i}/${j}`)
                await axios.post(config.url.callback, docs)
                console.clear()
            }

            console.table({['eToll Zambia']: {
                ['Time(sm)']: Date.now() - start,
                ['Total Docs']: data.length,
                ['Mem Size']: mem.size(data)
            }})

            console.log(data)
            return null
        } catch (e) {
            console.error(e)
            return next(e)
        }
    }
}