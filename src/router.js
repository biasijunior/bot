import Cards from './controllers/cards'
import Receipts from './controllers/receipts'

export default app => {
    app.get('/', (req, res) =>
        res.send({message: 'Book Now Scrapping Tools'}))

    app.get('/cards', Cards.get)
    app.put('/cards', Cards.edit)
    app.get('/receipts', Receipts.get)
}