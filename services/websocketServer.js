const WebSocket = require('ws');
const authentication = require("./authentication")
const services = require("./services")
const servicesModel = require("../models/servicesModel");

let wss;

const config = () => {
    wss = new WebSocket.Server({
        port: 4200,
    });

    handleConnections();
}

const handleConnections = () => {
    wss.on('connection', function connection(ws, req) {
        ws.on('message', message => {
            const msg = JSON.parse(message.toString())
            console.log(msg)
            authentication.authenticateJWTSimple(msg.accessToken)
                .then((user) => {
                    //ws.send("Started the process!");
                    if(msg.action.type == "runService"){
                        console.log("is runService")
                        servicesModel.getService(msg.action.serviceID)
                            .then(service => {
                                console.log(service)
                                services.runProject(
                                    'npm.cmd run start',
                                    "."+service.servicePath,
                                    (stdData) => {
                                        ws.send(stdData);
                                    }
                                );
                            })
                    }
                })
                .catch((error) => {
                    console.error(error);
                    ws.send("Access token invalid.")
                })

        });
    
        ws.on('close', message => {
            //console.log("Connection to client with IP: %s:%s lost.", ip, port);
        });
    });
}

module.exports = {
    config
}