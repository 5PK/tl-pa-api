const Router = require("express");
const paLib = require("../libs/patent-alert-lib");
const router = Router();

router.get("/fire", async (req, res) => {
  //start download
  paLib.downloadZip("ipa191128");
});

module.exports = router;
