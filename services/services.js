const fs = require('fs-extra')
const path = require("path")
const { exec } = require("child_process");
const { runMain } = require('module');


const initService = (serviceData) => {
    // copy the file over to the desired location
    fs.copySync('./public/express_template',"." + serviceData.servicePath)

    // set port in package.json
    fs.readFile("." + serviceData.servicePath + "/package.json", (error,data) => {
        let content = JSON.parse(data.toString());
        content.port = serviceData.port;

        fs.writeFile("." + serviceData.servicePath + "/package.json",JSON.stringify(content))

    })


    fs.readFile("." + serviceData.servicePath + "/.env", (error,data) => {
        let content = data.toString();
        content = content.replace("$PORT",serviceData.port);

        fs.writeFile("." + serviceData.servicePath + "/.env",content)
    })

    // run npm intall
    installProjectDependencies("."+serviceData.servicePath);

    // run the project with nodemon
    runProject("npm run live-server","."+serviceData.servicePath);

}

const installProjectDependencies = (cwd) => {
    exec("npm install" ,{cwd:cwd}, (error, stdout, stderr) => {
        
        if (error) {
            console.log(`error: ${error}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        //console.log(`stdout: ${stdout}`);
    });
}

const installProjectDependency = (cwd,dependency) => {
    exec("npm install " + dependency ,{cwd:cwd}, (error, stdout, stderr) => {
        
        if (error) {
            console.log(`error: ${error}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        //console.log(`stdout: ${stdout}`);
        
    });
}

const runProject = (cmd,cwd) => {
    exec(cmd,{cwd:cwd}, (error, stdout, stderr) => {
        
        if (error) {
            console.log(`error: ${error}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        //console.log(`stdout: ${stdout}`);
        
    });
}


module.exports = {
    initService,
    installProjectDependency,
    installProjectDependencies,

}