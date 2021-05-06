const camelize = data => {
    const o = {}
    for (const d in data)
        if (data.hasOwnProperty(d))
            o[d.toLowerCase()
                .replace(/((\s|_)\w)/g, k => k[1].toUpperCase())
                .replace(/\s\/|\./g, '')
                .replace(/\(.+/gi, '')
                ] = data[d]
    return o
}

export default camelize