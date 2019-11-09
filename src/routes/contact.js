import uuidv4 from "uuid/v4"
import { Router } from "express"
import models from "../models";
import { unauthorized, success, failure } from "../libs/response-lib";

const router = Router()

router.use(require('../libs/jwt-check-lib'))

router.get("/", async (req, res) => {
    console.log("ALERT: _______GET_______")
  
    console.log(req.query)
  
    let clientId = req.query.clientId;
  
    console.log(clientId)
  
    const alerts = await models.Alert.findAll({
      where: {
        bx3ClientId: parseInt(clientId)
      }
    })
  
    if (alerts == null || alerts == "" || alerts == ''){
      console.log("0")
      return res.send(failure('Alerts not Found!'));
    }else{
      console.log("1")
      console.log(alerts)
      return res.send(success(alerts))
    }
  })

  export default router