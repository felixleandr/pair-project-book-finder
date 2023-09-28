const {Profile, User} = require('../models')

class ControllerProfile {
    static showProfileById(req, res) {
        const {UserId} = req.params
        Profile.findOne({
            include: User,
            where: {id: UserId}
        },{
            where: {id: UserId}
        })
        .then((result) => {
            res.render(`profile`, {result})
        })
        .catch((err) => {
            res.send(err)
        })
    }

}

module.exports = ControllerProfile