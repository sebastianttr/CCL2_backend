const express = require('express');
const router = express.Router();

const servicesController = require("../controller/servicesController.js");
const authenticationService = require("../services/authentication.js");

router.use(authenticationService.authenticateJWT)

router.get("/",servicesController.getServices)
router.post("/create",servicesController.createService)
router.get("/getUsablePort",servicesController.getUsablePort)
router.get("/:id/getDirectoryTree",servicesController.getDirectoryTree)
router.route("/fileContent")
        .get(servicesController.getFileContent)
        .post(servicesController.setFileContent)

module.exports = router