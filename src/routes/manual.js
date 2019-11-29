import uuidv4 from "uuid/v4";
import { Router } from "express";
import models from "../models";
import { unauthorized, success, failure } from "../libs/response-lib";
import {getPatents, handleAlerts, downloadZip} from "../libs/patent-alert-lib";

const router = Router();


router.get("/fire", async (req, res) => {
  
    //start download
    downloadZip("ipa191128")
  })



export default router
