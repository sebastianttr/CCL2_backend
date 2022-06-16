const brokrUserModel = require("../models/brokrUserModel.js")
const authenticationService = require("../services/authentication");


const registerUser = (req,res,next) => {
    brokrUserModel.registerUser(req.body)
        .then(() => {
            res.status(200).send({
                success:true, 
            });
        })
        .catch((err) => {
            res.sendStatus(500);
        })
}

const loginUser = (req,res,next) => {
    brokrUserModel.getUsers()
            .then((users) => {
                authenticationService.authenticateUser(req.body,users,res);
            })
            .catch( (err) => {
                console.error(err);
                res.sendStatus(500);
            })
}

const getUserData = (req,res,next) => {
    //console.log(req.user.id)
    brokrUserModel.getUser(req.user.id)
        .then((user) => {
            //console.log("User found")
            res.status(200).send(user)
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        })
}

module.exports = {
    registerUser,
    loginUser,
    getUserData
}