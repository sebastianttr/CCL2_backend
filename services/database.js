const mysql = require('mysql2');

require('dotenv').config();

const config = mysql.createPool({
    host:"172.26.0.4",
    port: 3306,
    user: process.env.db_username,
    password: process.env.db_password,
    database:"cc211004"
})


/*  connection pooling is better for when 
    you make multiple request in a short time and you do not want to lose 
    the connetion to your database. 

*/


/*
config.connect((err)=>{
    if(err)
        throw err;
    
    console.log("Connected to database!")

})
*/

module.exports = {config};
