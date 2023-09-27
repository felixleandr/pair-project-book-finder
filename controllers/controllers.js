const {User,Book, Profile, Publisher} = require('../models')
const {Op} = require('sequelize')
const { sendRegistrationEmail } = require('../mailer');

class Controller {
    static registerPage(req, res){
        res.render('registerPage');
      }
    static loginPage(req,res){
        res.render('loginPage'); 
    }
    static logicRegister(req, res){
        const { username, email, password , role} = req.body;
        console.log(req.body)
        User.create({
            username: username,
            email: email,
            password: password ,
            role: role
        })
        .then(user => {
            sendRegistrationEmail(user.email);
            res.redirect('/login');
        })
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.render('registerPage', { error: 'Username atau email sudah ada. Silakan pilih yang lain.' });
            }  else {
                res.render('registerPage', { error: 'Terjadi kesalahan saat pendaftaran.' });
                console.error(err);
            }
        });
      }
    static loginLogic(req, res){
        const { username, password } = req.body;
        User.findOne({ where: { username } })
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            return user.isValidPassword(password);
        })
        .then(isMatch => {
            if (!isMatch) {
                throw new Error('Password is incorrect');
            }
             req.session.isAuthenticated = true;
            res.redirect('/');
        })
        .catch(err => {
            res.render('loginPage', { error: err.message });
            // console.log(err)
        });
      }
    static home(req, res){
        res.render('home')
    }

    static listBooks(req, res){
        const {search} = req.query

        let options = {
            include: Publisher
        }

        if(search){
            options.where = {
                title: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }

        Book.findAll(options)
        .then((result) => {
            res.render('list-books', {result})
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static showFormAddBook(req, res){
        const {errors} = req.query
        Publisher.findAll()
        .then((result) => {
            res.render('form-add-books', {result, errors})
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static addBook(req, res){
        const {title, author, imageUrl, link, PublisherId, isbn, descriptions} = req.body
        Book.create({
            title, author, imageUrl, link, PublisherId, isbn, descriptions 
        })
        .then(() => {
            res.redirect('/books')
        })
        .catch((err) => {
            if(err.name === "SequelizeValidationError"){
                err = err.errors.map(el => {
                    return el.message
                })
                res.redirect(`/books/add?errors=${err.join(';')}`)
            } else {
                res.send(err)
            }
        })
    }
}

module.exports = Controller