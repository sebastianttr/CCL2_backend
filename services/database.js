const mysql = require('mysql');

require('dotenv').config();

const config = mysql.createConnection({
    host:"atp.fhstp.ac.at",
    port: 8007,
    user: process.env.db_username,
    password: process.env.db_password,
    database:"cc211004"
})

config.connect((err)=>{
    if(err)
        throw err;
    
    console.log("Connected to database!")
})

module.exports = {config};
