const timestamp = (createdAt) => {
    let date = createdAt.getDate()
    let month = createdAt.getMonth() + 1
    let year = createdAt.getFullYear()
    return `${date}-${month}-${year}`
}

module.exports = timestamp