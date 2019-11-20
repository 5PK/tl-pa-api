import uuidv4 from "uuid/v4"
import { Router } from "express"
import models, { sequelize } from "../models";
import { unauthorized, success, failure } from "../libs/response-lib";
import { sendAsoEmail } from "../libs/aso-confirm-lib"
//import { Json } from "sequelize/types/lib/utils";


const router = Router()

router.use(require('../libs/jwt-check-lib'))

router.get("/", async (req, res) => {
  console.log("----------------")
  console.log(req.decoded)
  console.log("Get Request made")

  const clients = await models.Client.findAll({
    where: {
      bx3UserId: req.decoded.userId
    },
    include: [
      {model: models.Alert}
   ]
  });

  return res.send(success('Clients Found', clients))
})

router.get("/:clientId", async (req, res) => {

  console.log("get Client by ID")
  console.log(req.params)

  const client = await models.Client.findByPk(
    parseInt(req.params.clientId)
  )

  if (client == null || client == "" || client == ''){
    console.log("0")
    return res.send(failure('Client not Found!', client));
  }else{
    console.log("1")
    console.log(client)
    return res.send(success("Client found!",
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
  console.log(req.body)

  sequelize.transaction(t => {
    return models.Client.create({
      name: req.body.name,
      aso: req.body.aso,
      isVerified: false,
      primaryContact: req.body.primaryContact,
      bx3UserId: req.decoded.userId
    }, {transaction: t}).then(client => {
      console.log(client.dataValues.id)
      return models.AsoToken.create({
        token: makeid(5),
        email: req.body.aso,
        isActive: true,
        bx3ClientId:client.dataValues.id
      }, {transaction: t});
    }).then(asoToken => {
      console.log(asoToken)
      const emailRes = sendAsoEmail(req.body.aso, asoToken.dataValues.token);
      console.log(emailRes)
      if (emailRes.error){
        throw new Error();
      }else{
        return asoToken
      }
    });
  }).then(async result => {
    return res.send(success('Added Client!', result));
  }).catch(err => {
    console.log(err);
    return res.send(failure('Failed to add Client!', err));
  });
})

router.put("/:clientId", async (req, res) => {

  console.log("CLient Update Request")
  console.log(req.body)
  console.log(req.params)

  const client = await models.Client.update(
    {
      name: req.body.name,
      aso: req.body.phoneNumber,
      primaryContact: req.body.primaryContact
    },
    { where: { id: req.params.clientId } }
  )
  

  if(client[0] === 1){
    return res.send(success("Client Updated!", req.body));
  }else{
    return res.send(failure("Client Update Failed!", client));
  }
  
  
  
})

router.delete("/:clientId", async (req, res) => {
  const result = await models.Contact.destroy({
    where: { id: req.params.clientId, bx3UserId: req.decoded.userId}
  })

  return res.send(true)
})


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

console.log(makeid(5));

export default router
