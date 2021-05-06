import selectors from '../utils/selectors'
import config from '../utils/config'

const login = async () => {
    await page.waitForSelector(selectors.buttons.login)
    await page.$eval(selectors.username, (e, arg) => e.value = arg, config.username)
    await page.$eval(selectors.password, (e, arg) => e.value = arg, config.password)

    await Promise.all([page.waitForNavigation(), page.click(selectors.buttons.login)])
}

export default login