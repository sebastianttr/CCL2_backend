const db = require("../services/database").config
const proxy = require("express-http-proxy");

require('dotenv').config();

const services = require("../services/services")


const composeProjectPath = (user, service) => {
    const basePath = "/USER_SERVICES"

    const userIDFromEmail = user.email.substring(0,user.email.indexOf("@"));

    let newServiceName = ""
    newServiceName = basePath + "/" + service.serviceName.replaceAll(" ","_")
    newServiceName = newServiceName.concat("_" + userIDFromEmail);

    return newServiceName;
}


// ports from 49152 to 65535 can be used
// get all services, search for a the last usable port or gaps that are not filled by iterating through all
const getUsablePort = (userID) => new Promise(async (resolve,reject) => {
    const services = await getAllServices();
    
    const [portRangeStart, portRangeEnd] = [ parseInt(process.env.port_range_start) , parseInt(process.env.port_range_end) ]
    
    for(let i = portRangeStart; i < portRangeEnd;i++){
        const portReserved = services.find(el => el.port == i);
        if(!portReserved){
            //console.log("found one: " + i)
            resolve(i);
            break;
        }
    }

    reject({error:"no port found."});
})

const getAllServices = () => new Promise((resolve,reject) => {
    let sql = "SELECT * FROM BrokrServices;";

    db.query(sql,(err,res,fields) => {
        if(err instanceof Error){
            console.error(err);
            reject(err);
        }
        //console.log(res)
        resolve(res);
    })
})

const getServices = (userID) => new Promise((resolve,reject) => {
    let sql = "SELECT * FROM BrokrServices WHERE userID = " + parseInt(userID);

    db.query(sql,(err,res,fields) => {
        if(err){
            console.error(err);
            reject(err);
        }
        else {
            //console.log(res)
            resolve(res);

        }
    })
})

const getService = (id) => new Promise((resolve,reject) => {
    let sql = "SELECT * FROM BrokrServices WHERE ID = " + parseInt(id);

    db.query(sql,(err,res,fields) => {
        if(err){
            console.error(err);
            reject(err);
        }
        else {
            //console.log(res)
            resolve(res[0]);
        }
    })
})

const createService = (user,serviceData,app) => new Promise(async (resolve,reject) => {

    // get the last entry 
    let usablePort = await getUsablePort(user.id);
    let servicePath = composeProjectPath(user,serviceData);

    serviceData.servicePath = servicePath;
    serviceData.port = usablePort;

    // INSERT INTO DATABASE

    let sql = " INSERT INTO `BrokrServices` (`userID`, `serviceName`, `description`, `nodeVersion`,`servicePath`,`port`) VALUES " + 
    "(" + db.escape(user.id) + ", " 
    + db.escape(serviceData.serviceName) + ", " + 
    db.escape(serviceData.description) + ", " +
    db.escape(serviceData.nodeVersion) + ", " + 
    db.escape(serviceData.servicePath) + ", " + 
    db.escape(serviceData.port) + ");";

    db.query(sql,(err,response,fields) => {
        if(err instanceof Error){
            console.error(err);
            reject(err);
        }
        else {
            // COPY TEMPLATE TO PROJECTS FOLDER
            services.initService(serviceData);
            addProxy(user.id,serviceData,app);

            resolve();
        }
    })
})

const addProxy = (userID,serviceData,app) => new Promise((resolve,reject) => {
    getServices(userID)
        .then((services) => {
            const last = services.pop();
            app.use("/service/"+last.ID,proxy("localhost:"+serviceData.port))
        }) 
})

const deleteService = (serviceID) => new Promise((resolve,reject) => {
     // we can do it both async
     getService(serviceID)
        .then(service => {
            console.log(service.servicePath)
            services.removeProjectFolder(service.servicePath)
            
            let sql = "DELETE FROM `BrokrServices` WHERE `BrokrServices`.`ID` = " + parseInt(service.ID);

            db.query(sql,(err,res,fields) => {
                if(err instanceof Error){
                    reject(err);
                }

                resolve();
            })
            
        })
        .catch(error => {
            reject();
        })   
})

const deleteAllServices = (user) => new Promise((resolve,reject) => {
    //console.log(user)
    
    // we can do it both async
    getServices(user.ID)
        .then(servicesArr => {
            servicesArr.forEach(service => {
                services.removeProjectFolder(service.servicePath)
            })

            let sql = "DELETE FROM `BrokrServices` WHERE `BrokrServices`.`userID` = " + parseInt(user.ID);

            db.query(sql,(err,res,fields) => {
                if(err instanceof Error){
                    reject(err);
                }

                resolve();
            })
            
        })
        .catch(error => {
            reject();
        })    
})




module.exports = {
    getServices,
    getService,
    getAllServices,
    createService,
    getUsablePort,
    deleteService,
    deleteAllServices,
    composeProjectPath
}