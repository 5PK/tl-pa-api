import uuidv4 from "uuid/v4"
import { Router } from "express"
import models from "../models";
import { unauthorized, success, failure } from "../libs/response-lib";

const router = Router()

router.use(require('../libs/jwt-check-lib'))


router.put("/:contactId", async (req, res) => {

  console.log("contact Update Request")
  console.log(req.body)
  console.log(req.params)

  const contact = await models.Contact.update(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    },
    { where: { id: req.params.contactId } }
  )
  

  if(contact[0] === 1){
    return res.send(success("Contact Updated!", req.body));
  }else{
    return res.send(failure("Contact Update Failed!", contact));
  }
  
  
  
})


router.get("/", async (req, res) => {
    console.log("CONTACT: _______GET_______")
  
    console.log(req.query)
  
    let clientId = req.query.clientId;
  
    console.log(clientId)
  
    const contacts = await models.Contact.findAll({
      where: {
        bx3ClientId: parseInt(clientId)
      }
    })
  
    if (contacts == null || contacts == "" || contacts == ''){
      console.log("0")
      return res.send(failure('Contacts not Found!', contacts));
    }else{
      console.log("1")
      console.log(contacts)
      return res.send(success('Contacts Found!',contacts))
    }
  })

  export default router