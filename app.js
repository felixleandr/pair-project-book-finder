const express = require('express')
const app = express()
const port = 7000
const Controller = require('./controllers/controllers')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.get('/', Controller.home)
app.get('/books', Controller.listBooks)
app.get('/books/add', Controller.showFormAddBook)
app.post('/books/add', Controller.addBook)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})