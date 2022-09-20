const servicesModel = require("../models/servicesModel")
const proxy = require('express-http-proxy');


const config = (app) => new Promise((resolve,reject) => {

    servicesModel.getAllServices()
        .then(services => {
            services.forEach(service => {
                //console.log("/service"+service.ID,"localhost:"+service.port)
                app.use("/service/"+service.ID,proxy("localhost:"+service.port))
            });
        
            resolve();
        })
})

module.exports = {config}