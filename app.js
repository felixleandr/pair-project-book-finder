const express = require('express')
const session = require('express-session');
const app = express()
const port = 3000
require('dotenv').config();
const Controller = require('./controllers/controllers')
const ControllerProfile = require('./controllers/profiles')

app.use(session({
  secret: 'Hactiv8',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   
}));

function isAuthenticated(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    next(); 
  } else {
    res.redirect('/login');
  }
}

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.get('/register', Controller.registerPage);
app.post('/register', Controller.logicRegister);
app.get('/login',Controller.loginPage );
app.post('/login',Controller.loginLogic );


app.get('/',isAuthenticated, Controller.home) // isauthenticated ini buat session nya jd klo mau masuk 
//halaman ini harus login dulu, yang berari kita harus bikin button logut juga nanti, ini terapinnya nanti aja klo semua
//pagenya udah selesai biar ga ribet harus login
app.get('/books', Controller.listBooks)
app.get('/books/add', Controller.showFormAddBook)
app.post('/books/add', Controller.addBook)
app.get('/books/:id/edit', Controller.showFormEditBook)
app.get('/books/:id/delete', Controller.deleteBook)
app.post('books/:id/edit', Controller.updateBook)
app.get('/:UserId/profile', ControllerProfile.showProfileById)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})