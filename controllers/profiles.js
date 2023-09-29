const {Profile, User, Favorite, Book, Publisher} = require('../models')

class ControllerProfile {
    static showProfileById(req, res) {
        const { userId } = req.params;
        let result = '';
    
        User.findOne({
            include: {
                model: Profile,
                where: { id: userId }
            }
        }, { where: { id: userId } })
            .then((data) => {
                result = data;
                return Favorite.findAll({
                    include: {
                        model: Book,
                        include: Publisher
                    },
                    where: { ProfileId: userId }
                })
            })
            .then((favorites) => {
                res.render(`profile`, { result, favorites, userId: req.session.userId })
            })
            .catch((err) => {
                res.send(err)
            })
    }
    

    static addFavoriteBook(req, res) {
        const { bookId } = req.params;
        const profileId = req.session.profileId; 
    
        Favorite.create({
            ProfileId: profileId,
            BookId: bookId
        })
        .then(() => {
            res.redirect(`/${req.params.userId}/books`);
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
    }
    
    static removeFavoriteBook(req, res) {
        const { bookId } = req.params;
        const profileId = req.session.profileId;
    
        Favorite.destroy({
            where: {
                ProfileId: profileId,
                BookId: bookId
            }
        })
        .then(() => {
            res.redirect(`/${profileId}/profile`);
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
    }
}


module.exports = ControllerProfile