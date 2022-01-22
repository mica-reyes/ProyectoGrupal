const  User  = require ('../../db').models.User;
const SegurityToken = require('../../db').models.SegurityToken;


module.exports = async function (req, res, next) {

    try{
        const { token } = req.body;

        if(!token) {
            res.status(400).send({
                message: 'A token is required. Check your mail'
            })
        } else {
            const userDb = await SegurityToken.findOne({
                where: {
                    token: token
                }
            })

            if (!userDb){
                return res.status(403).send({
                    message: "Something went wrong. Check the data"
                })
            } else {
                const emailUser = userDb.email;
                const confirmUser = await User.update({
                    verifieldUser: true
                }, {
                    where: {
                        email: emailUser
                    }
                })

                res.status(200).send("User verified successfully")

                await SegurityToken.destroy({
                    where: {
                        token: token
                    }
                })
            }
        }
    } catch (error) {
        next(error)
    }

}