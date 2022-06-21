const brokrUserModel = require("../models/brokrUserModel.js")
const authenticationService = require("../services/authentication");
const servicesModel = require("../models/servicesModel")

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
    brokrUserModel.getUsers(true)
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

const changeNames = (req,res,next) => {
    brokrUserModel.changeNames(req.body)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

const changePassword = (req,res,next) => {
    brokrUserModel.getUser(req.user.id,true)
        .then(async (user) => {
            let pwOK = await authenticationService.checkPassword(req.body.oldPassword,user.password);

            if(pwOK){
                brokrUserModel.changePassword(req.body.newPassword,user.ID)
                    .then(() => {
                        res.sendStatus(200);
                    })
                    .catch(err => {
                        res.status(500).send(err)
                    })
            }           
        })
}

const deleteUser = async (req,res,next) => {
    const user = await brokrUserModel.getUser(req.user.id);

    servicesModel.deleteAllServices(user)
        .then(()=> {
            brokrUserModel.removeUser(req.user.id)
                .then(() => {
                    res.send("OK")
                })
        })
        .catch(err => {

        })

    /*
    
        */
}

module.exports = {
    registerUser,
    loginUser,
    getUserData,
    changeNames,
    changePassword,
    deleteUser
}