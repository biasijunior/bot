import chokidar from 'chokidar'

const observer = () =>
    new Promise((resolve, reject) => {
        const watcher = chokidar.watch(downloadPath, {ignored: /^\./, persistent: true})
        watcher.on('add', path => {
            resolve(path)
            watcher.close().then(() => console.log('success: watcher closed'))
        }).on('error', err => {
            watcher.close().then(() => console.log('error'))
            reject(err)
        })
    })

export default observer