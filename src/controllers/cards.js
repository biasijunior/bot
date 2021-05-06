import axios from 'axios'

import launch from '../repos/launch'
import CardRepo from '../repos/card'
import config from '../utils/config'

const getBody = async (action = 'enable') => {
    const {data: cards} = await axios.get('https://retail.etoll.co.zm/api/v2/callbacks/cards', {
        data: {blocked: action === 'disable'}
    })
    return {cards, action}
}

export default {
    get: async (req, res, next) => {
        try {
            res.send('Transaction started.')
            const data = await launch(CardRepo.get)
            await axios.post('https://retail.etoll.co.zm/api/v1.0/cards/populate', data)
            return null
        } catch (e) {
            return next(e)
        }
    },
    edit: async (req, res, next) => {
        try {
            res.send('Transaction started.')
            const body = req.body.cards ? req.body : await getBody(req.body.action)

            if (!body.cards.length) return null

            const data = await launch(CardRepo.edit, body)
            await axios.post(config.url.block_callback, data)
            return null
        } catch (e) {
            return next(e)
        }
    }
}