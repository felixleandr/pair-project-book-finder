const express = require('express')
const session = require('express-session');
const app = express()
const port = 3000
require('dotenv').config();
const Controller = require('./controllers/controllers')
const ControllerProfile = require('./controllers/profiles')

app.use(session({
  secret: process.env.SESSION_SECRET,  
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

app.get("/", (req,res)=>{
  res.redirect("/login")
})
app.get('/register', Controller.registerPage);
app.post('/register', Controller.logicRegister);
app.get('/login',Controller.loginPage );
app.post('/login',Controller.loginLogic );
app.get('/logout', Controller.logoutLogic);


app.get('/:userId/books/add',isAuthenticated, Controller.showFormAddBook)
app.post('/:userId/books/add',isAuthenticated, Controller.addBook)
app.get('/:userId/profile',isAuthenticated, ControllerProfile.showProfileById)
app.get('/:userId/profile/favorites/:bookId',isAuthenticated, ControllerProfile.removeFavoriteBook)
app.get('/:userId/books/:id/edit',isAuthenticated, Controller.showFormEditBook)
app.post('/:userId/books/:id/edit',isAuthenticated, Controller.updateBook)
app.get('/:userId/books/:id/delete',isAuthenticated, Controller.deleteBook)

app.get('/:userId', isAuthenticated, Controller.home);
app.get('/:userId/books',isAuthenticated, Controller.listBooks)
app.post('/:userId/books/:bookId/favorite', isAuthenticated, ControllerProfile.addFavoriteBook);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})