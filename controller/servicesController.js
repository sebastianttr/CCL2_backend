const servicesModel = require("../models/servicesModel")

const getServices = (req,res,next) => {
    servicesModel.getServices()
        .then((data) => {
            console.log("data: " + data)
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send("An error appeared! \n" + err)
        })
}

const createService = (req,res,next) => {
    servicesModel.createService(req.user,req.body)
        .then(() => {
            res.send("Added a new service!");
        })
        .catch((err) => {
            res.status(500).send("An error appeared! \n" + err)
        })
}

const getUsablePort = (req,res,next) => {
    servicesModel.getUsablePort()
        .then((data) => {
            console.log(data)
            res.send(data.toString());
        })
        .catch((err) => {
            res.status(500).send("An error appeared! \n" + err.error)
        })
}

module.exports = {
    getServices,
    createService,
    getUsablePort
}