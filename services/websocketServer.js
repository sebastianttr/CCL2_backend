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
            authentication.authenticateJWTSimple(msg.accessToken)
                .then((user) => {
                    //ws.send("Started the process!");
                    if(msg.action.type == "runService"){
                        servicesModel.getService(msg.action.serviceID)
                            .then(service => {
                                services.runService(
                                    'npm run start', // redo this 
                                    "."+service.servicePath,
                                    (stdData) => {
                                        ws.send(stdData);
                                    }
                                );
                            })
                    }
                    else if(msg.action.type == "stopService"){
                        servicesModel.getService(msg.action.serviceID)
                            .then(service => {
                                services.stopService(
                                    service.port
                                );
                            })
                    }
                    else if(msg.action.type == "shellCommand"){
                        servicesModel.getService(msg.action.serviceID)
                            .then(service => {
                                services.executeShell(
                                    msg.action.command,
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