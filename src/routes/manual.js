const Router = require("express");
const paLib = require("../libs/patent-alert-lib");
var Path = require("path");
const router = Router();

router.get("/fireFullTest", async (req, res) => {
  //start download
  paLib.downloadZip("ipa191128");
});

router.get("/fireParse", async (req, res) => {
  //start Parse
  var path = Path.resolve(__dirname);

  var newpath = path.replace("routes", "libs/patentFiles/ipa191128.zip");

  console.log(newpath)
  paLib.getPatents(newpath, "ipa191128");
});

router.get("/fireAlert", async (req, res) => {
  //start Parse
  paLib.handleAlerts();
});


module.exports = router;
