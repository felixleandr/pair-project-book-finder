const {Profile, User, Favorite, Book} = require('../models')

class ControllerProfile {
    static showProfileById(req, res) {
        console.log(req.params, ">>>");
        const {userId} = req.params
        let result = ''
        User.findOne({
            include: {
                model: Profile,
                where: {id: userId}
            }
        }, {where: {id: userId}})
        .then((data) => {
            console.log(data,"////");
            result = data
            return Favorite.findAll({
                include: {
                    model: Book,
                    where: {
                        id
                    }
                }
            })
        })
        .then((books) => {
            console.log(books);
            res.render(`profile`, {result, books})
        })
        .catch((err) => {
            res.send(err)
        })
    }

}

module.exports = ControllerProfile