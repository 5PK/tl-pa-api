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
    return res.send(failure('Alerts not Found!', alerts));
  }else{
    console.log("1")
    console.log(alerts)
    return res.send(success('Alerts Found!',alerts))
  }
})

/*
router.get("/:alertId", async (req, res) => {
  const alert = await models.Alert.findById(
    req.params.alertId,
    {
      where: {
        bx3AlertId: req.decoded.alertId,

      }
    }
  )
  return res.send(alert)
})
*/
router.post("/", async (req, res) => {
  console.log("ALERT: _______POST_______")
  console.log(req.body.name)
  const alert = await models.Alert.create({
    name: req.body.name,
    contacts: req.body.contacts,
    isActive: true,
    query: req.body.query,
    bx3ClientId: req.body.clientId,
    bx3UserId: req.decoded.userId
  })

  return res.send(alert)
})

router.put("/:alertId", async (req, res) => {

  const alert = await models.Alert.update(
    {
        name: req.body.name,
        contacts: req.body.contacts,
        isActive: req.body.isActive
    },
    { where: { id: req.params.alertId } }
  )

  return res.send(alert)
})

router.delete("/:alertId", async (req, res) => {
  const result = await models.Alert.destroy({
    where: { id: req.params.alertId}
  })

  return res.send(result)
})

export default router
