const servicesModel = require("../models/servicesModel")
const services = require("../services/services")

const getServices = (req,res,next) => {
    console.log("User ID", req.user.id)
    servicesModel.getServices(req.user.id)
        .then((data) => {
            //console.log("data: " + data)
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send("An error appeared! \n" + err)
        })
}

const createService = (req,res,next) => {
    servicesModel.createService(req.user,req.body,req.app)
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
            //console.log(data)
            res.send(data.toString());
        })
        .catch((err) => {
            res.status(500).send("An error appeared! \n" + err.error)
        })
}

const getDirectoryTree = (req,res,next) => {
    let projectID = decodeURIComponent(req.params.id);
    //console.log(projectID);

    servicesModel.getService(projectID)
    .then(data => {
        //(data)
        res.send(services.getDirectoryTree(data));
    })
}


const getFileContent = (req,res,next) => {
    services.getFileContent(req.query.path)
        .then((data)=> {
            res.send(data)
        })
        .catch(error => {
            res.status(500).send("Path is not available.")
        })
}

const setFileContent = (req,res,next) => {
    //console.log("Body: "+ req.body.content)
    services.setFileContent(req.query.path,req.body.content)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err)=> {
            console.error(err)
            res.status(500).send(err);
        })
}

const deleteService = (req,res,next) => {
    servicesModel.deleteService(req.query.id)
        .then(() => {
            res.send("ok")
        })

    //services.removeProjectFolder()
}

module.exports = {
    getServices,
    createService,
    getUsablePort,
    getDirectoryTree,
    getFileContent,
    setFileContent,
    deleteService
}