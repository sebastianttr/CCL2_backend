const fs = require('fs-extra')
const path = require("path")
const { exec,execFile, spawn } = require("child_process");
const { runMain } = require('module');
const dirTree = require('directory-tree');


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
    //runProject("npm run live-server","."+serviceData.servicePath);

}

const getDirectoryTree = (serviceData) => {
    return dirTree("."+serviceData.servicePath,{exclude:/node_modules/,attributes: ["type", "extension"]})
}

const getFileContent = (filePath) => new Promise((resolve,reject) => {
    fs.readFile("." + filePath).then((data)=> {
        resolve(data.toString());
    })
    .catch(error => {
        if(error instanceof Error){
            console.error("Error: " + error);
            reject(error);
        }
    })
})

const setFileContent = (filePath,content) => new Promise((resolve,reject) => {
    fs.writeFile("."+filePath,content,{encoding:'utf8'},(err) => {
        if(err instanceof Error){
            reject(err);
        }
        else {
            resolve();
        }
    })
})

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

const runProject = async (cmd,cwd,callback) => {
    /*
    exec(cmd,{cwd:cwd}, (error, stdout, stderr) => {
        console.log("i am executed")
        
        if (error) {
            console.log(`error: ${error}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }

        callback(stdout);
        console.log(`stdout: ${stdout}`);
        
    });
    */

    let ls = spawn('npm', ['run',"live-server"], {
        cwd: cwd,        
    })

    ls.stdout.setEncoding('utf8');
    ls.stderr.setEncoding('utf8');
    ls.stdout.on('data', data => callback(data));
    ls.stderr.on('data', data => callback(data));    
}


module.exports = {
    initService,
    installProjectDependency,
    installProjectDependencies,
    getDirectoryTree,
    getFileContent,
    setFileContent,
    runProject
}