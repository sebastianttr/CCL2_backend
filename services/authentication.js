const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.access_token_secret

const bypassPaths = [
    "/users/",
    "/users/login",
    "/users/register",
]

const checkPassword = async (password,hash) => {
    let pw = await bcrypt.compare(password,hash);
    return pw;
}

// stuff here
const authenticateUser = async ({email,password}, users,res) => {
    const user = users.find(u => u.email === email);



    if(user) {
        const pwIsOK = await checkPassword(password,user.password);

        if(pwIsOK){
            const accessToken = jwt.sign({id:user.ID,email:user.email},ACCESS_TOKEN_SECRET);
            res.send({
                accessToken:accessToken 
            }); 
        }
        else {
            res.send({
                error:"user not found!"
            });
        }        
    }
    else{
        res.send({
            error:"user not found!"
        });
    }
}

const authenticateJWT = async (req,res,next) => {
    //console.log(req.baseUrl + req.path)   
    
    if(bypassPaths.includes(req.baseUrl + req.path)){
        //console.log("Path is bypassed")
        next();
        return;
    }
    else {
        console.log(req.headers)
        const token = req.headers["authorization"].substring(7)
        //console.log(token)

        if(token){
            jwt.verify(token,ACCESS_TOKEN_SECRET,(err,user) => {
                if(err){
                    return res.sendStatus(403);
                }
                //console.log(user);
                req.user = user;
                next();
            })
        }
        else{
            res.sendStatus(401);
        }
    }
}

const authenticateJWTSimple = (token) => new Promise((resolve,reject) => {

    token = token.substring(7);
    //console.log(token)

    if(token){
        jwt.verify(token,ACCESS_TOKEN_SECRET,(err,user) => {
            if(err){
                reject(err);
            }
            resolve(user);
        })
    }
    else{
        reject("No token!");
    }
    
})

module.exports = {
    authenticateUser,
    authenticateJWT,
    authenticateJWTSimple
}