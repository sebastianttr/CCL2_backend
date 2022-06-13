var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Hello World!");
});

router.get("/text",function(req,res,next) {
  console.log("Got a ping. ")
  res.send("pong")
})

module.exports = router;
