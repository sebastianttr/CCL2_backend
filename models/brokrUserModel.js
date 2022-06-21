const db = require('../services/database').config;
const bcrypt = require("bcrypt");

const getUsers = (withPw) => new Promise((resolve,reject) => {
    db.query("SELECT * FROM `BrokrUsers`",(err,users,fields) =>{
        if(err) reject(err)

        let passwordRemovedUsers = [];
        users.forEach(element => {
            if(!withPw){
                delete element.passwordSalt;
                delete element.password;
            }
            passwordRemovedUsers.push(element);
        });

        resolve(passwordRemovedUsers);
    })
});

const getUser = (id,withPw) => new Promise((resolve,reject) => {
    let sql = "SELECT * FROM `BrokrUsers` WHERE ID = " + parseInt(id);

    db.query(sql,(err,res,fiels) => {
        if(err) {
            console.error(err)
            reject({error:"User not found"});
        }   
        else if(!res.length){
            reject({error:"User not found"});
        }
        else {
            if(!withPw){
                delete res[0].passwordSalt;
                delete res[0].password;
            }
            resolve(res[0]);
        }
    })

})

const registerUser = (userData) => new Promise(async (resolve,reject) => {
    let passwordSalt = Math.round(Math.random()*10);
    let passwordEncrypted = await bcrypt.hash(userData.password,passwordSalt);

    let sql = " INSERT INTO `BrokrUsers` (`email`, `firstName`, `lastName`, `password`,`passwordSalt`) VALUES " + 
    "(" + db.escape(userData.email) + ", " + 
    db.escape(userData.firstName) + ", " +
    db.escape(userData.lastName) + ", " + 
    db.escape(passwordEncrypted) + ", " + 
    db.escape(passwordSalt) + ");";

    //console.log(sql);

    db.query(sql,(err,res,fields)=> {
        if(err) {
            console.error(err)
            reject(err);
        }
        else{
            resolve();
        }
    });
});

const loginUser = (userData) => new Promise(async (resolve,reject) => {
    let sql = "SELECT * FROM `BrokrUsers` WHERE email = " + db.escape(user.email) + "; ";
    //console.log(user.email)
    db.query(sql,(err,res,fields)=> {
        if(err) {
            console.error(err)
            reject(err);
        }
        else{
            if(sha1(user.password) === res[0].password){
                let accessToken = 
                resolve({loginSuccess: true,accessToken: res[0].accessToken});
            }
            else{
                resolve({loginSuccess: false});
            }
        }
    });
});

const changeNames = (user) => new Promise((resolve,reject) => {
    // UPDATE `BrokrUsers` SET `lastName` = 'User1' WHERE `BrokrUsers`.`ID` = 22;
    let sql = "UPDATE `BrokrUsers` SET `firstName` = " + 
        db.escape(user.firstName) + " , `lastName` = " +
        db.escape(user.lastName) + " WHERE `BrokrUsers`.`id` = " +
        parseInt(user.id) + ";";

    console.log(sql);

    db.query(sql,(err,res,fields) => {
        if(err instanceof Error){
            console.error(err);
            reject(err);
        }

        resolve();
    })
})

const changePassword = (password,userID) => new Promise(async (resolve,reject) => {
    let passwordEncrypted = await bcrypt.hash(password,10);

    let sql = "UPDATE `BrokrUsers` SET `password` = " + 
        db.escape(passwordEncrypted) + " WHERE `BrokrUsers`.`id` = " + parseInt(userID)

    db.query(sql,(err,res,fields) => {
        if(err instanceof Error){
            console.error(err);
            reject(err);
        }

        resolve();
    })
})

const removeUser = (userID) => new Promise((resolve,reject) => {
    let sql = "DELETE FROM `BrokrUsers` WHERE `BrokrUsers`.`id` = " +
    parseInt(userID) + ";";

    db.query(sql,(err,res,field) => {
        if(err instanceof Error){
            console.error(err);
            reject(err);
        }

        resolve();
    })
})

module.exports = {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    changeNames,
    changePassword,
    removeUser
}