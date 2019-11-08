import uuidv4 from "uuid/v4"
import { Router } from "express"
import models from "../models";
import { unauthorized, success, failure } from "../libs/response-lib";


const router = Router()

router.use(require('../libs/jwt-check-lib'))

router.get("/", async (req, res) => {
  console.log("----------------")
  console.log(req.decoded)
  console.log("Get Request made")

  const clients = await models.Client.findAll({
    where: {
      bx3UserId: req.decoded.userId
    }
  })

  console.log(clients)

  return res.send(clients)
})

router.get("/:clientId", async (req, res) => {

  console.log("get Client by ID")
  console.log(req.params)

  const client = await models.Client.findByPk(
    parseInt(req.params.clientId)
  )

  if (client == null || client == "" || client == ''){
    console.log("0")
    return res.send(failure('Client not Found!'));
  }else{
    console.log("1")
    console.log(client)
    return res.send(success(
      {
        id: client.id, 
        name: client.name, 
        aso: client.aso, 
        primaryContact: client.primaryContact,
        createdAt: client.createdAt
      }));
  }

})

router.post("/", async (req, res) => {
  console.log("CLIENT CREATE")
  console.log(req.decoded.userId)
  const client = await models.Client.create({
    name: req.body.name,
    aso: req.body.phoneNumber,
    isVerified: false,
    primaryContact: req.body.email,
    bx3UserId: req.decoded.userId
  })

  if (client == null || client == "" || client == ''){
    return res.send(failure('Failed to Add!'));
  }else{
    return res.send(success('Client Added!'));
  }

})

router.put("/:clientId", async (req, res) => {

  const client = await models.Client.update(
    {
      name: req.body.name,
      aso: req.body.phoneNumber,
      primaryContact: req.body.primaryContact
    },
    { where: { id: req.params.clientId } }
  )

  return res.send(client)
})

router.delete("/:clientId", async (req, res) => {
  const result = await models.Contact.destroy({
    where: { id: req.params.clientId, bx3UserId: req.decoded.userId}
  })

  return res.send(true)
})

export default router
