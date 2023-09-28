const express = require('express')
const session = require('express-session');
const app = express()
const port = 7000
require('dotenv').config();
const Controller = require('./controllers/controllers')

app.use(session({
  secret: 'Hactiv8',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   
}));

function isAuthenticated(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
      if (req.params.userId) {
          if (req.session.userId != req.params.userId) {
              return res.status(403).send('Unauthorized access');
          }
      }
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


app.get('/books/add', Controller.showFormAddBook)
app.post('/books/add', Controller.addBook)

app.get('/:userId', isAuthenticated, Controller.home);
app.get('/:userId/books',isAuthenticated, Controller.listBooks)
app.post('/:userId/books/:bookId/favorite', isAuthenticated, Controller.addFavoriteBook);
// app.delete('/books/:bookId/favorite', isAuthenticated, Controller.removeFavoriteBook);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})