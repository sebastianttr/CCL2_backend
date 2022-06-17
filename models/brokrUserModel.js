const db = require('../services/database').config;
const bcrypt = require("bcrypt");

const getUsers = () => new Promise((resolve,reject) => {
    db.query("SELECT * FROM `BrokrUsers`",(err,users,fields) =>{
        if(err) reject(err)
        resolve(users);
    })
});

const getUser = (id) => new Promise((resolve,reject) => {
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

module.exports = {
    getUsers,
    getUser,
    registerUser,
    loginUser
}