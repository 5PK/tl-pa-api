import { Router } from "express";
import {getPatents, handleAlerts, downloadZip} from "../libs/patent-alert-lib";
const router = Router();


router.get("/fire", async (req, res) => {
  
    //start download
    downloadZip("ipa191128")
  })



export default router
