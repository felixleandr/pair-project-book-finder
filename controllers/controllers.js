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
}

module.exports = Controller