import uuidv4 from "uuid/v4";
import { Router } from "express";
import models from "../models";
import { unauthorized, success, failure } from "../libs/response-lib";
import {getPatents, handleAlerts, downloadZip} from "../libs/patent-alert-lib";

const router = Router();


router.get("/fireManualAlert", async (req, res) => {

    var d = new Date();
    console.log(d.toLocaleString());
    var localdate = d.toLocaleString()
    var splitDate = localdate.split(',')
    var splitDate2 = splitDate[0].split('/')
  
    var filename = "ipa" + d.getFullYear().toString().substr(-2) + splitDate2[0] +splitDate2[1]
    //start download
    downloadZip(filename)
  })



export default router
