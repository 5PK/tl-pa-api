import uuidv4 from "uuid/v4";
import { Router } from "express";
import models from "../models";
import { unauthorized, success, failure } from "../libs/response-lib";

const router = Router();

router.use(require('../libs/jwt-check-lib'));

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
    return res.send(failure('Alerts not Found!', alerts));
  }else{
    console.log("1")
    console.log(alerts)
    return res.send(success('Alerts Found!',alerts))
  }
})


router.post("/", async (req, res) => {
  console.log("ALERT: _______POST_______")
  console.log(req.body.name)

  console.log(req.body)

  const alert = await models.Alert.create({
    name: req.body.name,
    contacts: JSON.stringify(req.body.contacts),
    isActive: true,
    query: JSON.stringify(req.body.query),
    bx3ClientId: req.body.clientId,
  })

  console.log(alert)

  if (alert == null || alert == "" || alert == ''){
    return res.send(failure('Failed to Add!', alert));
  }else{
    return res.send(success('Alert Added!', alert));
  }
})

router.put("/:alertId", async (req, res) => {
  console.log("alert update")

  const alert = await models.Alert.update(
    {
        name: req.body.name,
        contacts: "[" + String(req.body.contacts) + "]",
        isActive: req.body.isActive,
        query: JSON.stringify(req.body.query)
    },
    { where: { id: req.params.alertId } }
  )

  if (alert[0] === 1) {
    return res.send(success("Alert Updated!", req.body));
  } else {
    return res.send(failure("Alert Update Failed!", alert));
  }
})


router.delete("/:alertId", async (req, res) => {


  console.log( req.params.alertId )

  const result = await models.Alert.destroy({
    where: { id: req.params.alertId }
  });
  return res.send(success("Alert Deleted!", result));
});



export default router
