const {User,Book, Profile, Publisher,Favorite} = require('../models')

const {Op} = require('sequelize')
const { sendRegistrationEmail } = require('../mailer');
const timestamp = require('../helpers/timestamp')

class Controller {
    static registerPage(req, res){
        res.render('registerPage');
      }
    static loginPage(req,res){
        res.render('loginPage'); 
    }
    static logicRegister(req, res){
        const { username, email, password , role} = req.body;
        // console.log(req.body)
        Profile.create
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
        // console.log(password);
        User.findOne({ where: { username } })
        .then(user => {
            if (!user) {
                throw new Error('User not found')//////
            }
            const isMatch = user.isValidPassword(password);
            return { user, isMatch };
        })
        .then(result => {
            if (result.isMatch !== true) {
                throw new Error('Password is incorrect');
            }
            req.session.isAuthenticated = true;
            req.session.userId = result.user.id;
            
            return Profile.findOne({ where: { UserId: result.user.id } })
            .then(profile => ({ user: result.user, profile }));
        })
        .then(data => {
            req.session.profileId = data.profile.id;
            res.redirect(`/${data.user.id}`);
        })
        .catch(err => {
            res.render('loginPage', { error: err.message });
            // console.log(err)
        });
    }
    
    static home(req, res){
        res.render('home',{ userId: req.session.userId })
    }

    static listBooks(req, res){
        const {search, PublisherId} = req.query
        let showBookByPublisher = ''

        let options = {
            include: Publisher,
            order: [
                ["title","ASC"]
            ]
        }

        if(search){
            options.where = {
                title: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }
        
        if(PublisherId){
            showBookByPublisher = Book.getBooksByPublisher(options,PublisherId, timestamp)
        }
        
        if(search && PublisherId){
            options.where = {
                title: {
                    [Op.iLike]: `%${search}%`
                }
            }
            showBookByPublisher = Book.getBooksByPublisher(options,PublisherId, timestamp)
        }
        
        let result = ''
        Book.findAll(options)
        .then((data) => {
            result = data
            return Publisher.findAll()
        })
        .then((publishers) => {
            res.render('list-books', {result, publishers, timestamp,userId: req.session.userId })
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static showFormAddBook(req, res){
        const {errors} = req.query
        Publisher.findAll()
        .then((result) => {
            res.render('form-add-books', {result, errors, userId: req.session.userId })
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static addBook(req, res){
        const {userId} = req.params
        const {title, author, imageUrl, link, PublisherId, isbn, descriptions} = req.body
        Book.create({
            title, author, imageUrl, link, PublisherId, isbn, descriptions 
        })
        .then(() => {
            res.redirect(`/${userId}/books`)
        })
        .catch((err) => {
            if(err.name === "SequelizeValidationError"){
                err = err.errors.map(el => {
                    return el.message
                })
                res.redirect(`/${userId}/books/add?errors=${err.join(';')}`)
            } else {
                res.send(err)
            }
        })
    }
    static showFormEditBook(req, res){
        const {errors} = req.query
        const {id} = req.params
        let result =''
        Book.findOne({
            include : Publisher,
            where: {id}
        })
        .then((book) => {
            result = book
            return Publisher.findAll()
        })
        .then((publishers) => {
            res.render('form-edit-books', {result, publishers, errors ,userId: req.session.userId})
        })
        .catch((err) => {
            res.send(err)
        })
    }

    static updateBook(req, res) {
        const {title, author, imageUrl, link, PublisherId, isbn, descriptions} = req.body
        const {id} = req.params
        Book.update({
            title, author, imageUrl, link, PublisherId, isbn, descriptions
        }, {
            where: {id}
        })
        .then(() => {
            res.redirect(`/${req.params.userId}/books`)
        })
        .catch((err)=>{
            if(err.name === "SequelizeValidationError"){
                err = err.errors.map(el => {
                    return el.message
                })
                res.redirect(`/${req.params.userId}/books/${id}/edit?errors=${err.join(';')}`)
            } else {
                res.send(err)
            }
        })
    }

    static deleteBook(req, res){
        console.log(req.params);
        const {userId,id} = req.params
        let profileId = userId
        Favorite.findOne({
            where:{
                ProfileId: profileId,
                BookId: id
            }
        })
        .then((result) => {
            if(result){
                return Favorite.destroy({
                        where: {
                            ProfileId: profileId,
                            BookId:id
                        }
                })
                .then(() => {
                    return Book.destroy({where: {id}})
                })
            } else {
                return Book.destroy({where: {id}})
            }
        })
        .then(() => {
            console.log("ini ke destroy");
            res.redirect(`/${userId}/books`)
        })
        .catch((err)=>{
            res.send(err)
        })
    }
}

module.exports = Controller