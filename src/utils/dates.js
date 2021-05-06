const nDaysToday = (n = 0) => {
    const today = new Date().toLocaleString('en-US', {timeZone: 'Africa/Lusaka'})
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - n)

    const [year, month, day] = yesterday.toISOString().split('T')[0].split('-')

    return `${month}/${day}/${year}`
}

export default {
    nDaysToday
}