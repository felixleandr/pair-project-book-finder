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



app.get('/:userId/books/add', Controller.showFormAddBook)
app.post('/:userId/books/add', Controller.addBook)
app.get('/:userId/profile', ControllerProfile.showProfileById)
app.get('/:userId/books/:id/edit', Controller.showFormEditBook)
app.post('/:userId/books/:id/edit', Controller.updateBook)
app.get('/:userId/books/:id/delete', Controller.deleteBook)

app.get('/:userId', isAuthenticated, Controller.home);
app.get('/:userId/books',isAuthenticated, Controller.listBooks)
app.post('/:userId/books/:bookId/favorite', isAuthenticated, Controller.addFavoriteBook);
// app.delete('/books/:bookId/favorite', isAuthenticated, Controller.removeFavoriteBook);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})