const {Book, Profile, Publisher} = require('../models')
const {Op} = require('sequelize')

class Controller {
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