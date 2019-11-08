import { Router } from "express"
import jwt from "jsonwebtoken"
import buildResponse from "../libs/response-lib"

const router = Router();

router.post('/token', async (req,res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": req.body.email,
            "name": req.body.name
        }
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE})
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token

        await req.context.models.Token.update(
            {
              name: req.body.name,
              aso: req.body.phoneNumber,
              primaryContact: req.body.primaryContact
            },
            { where: { id: req.params.clientId } }
          );

        res.send(buildResponse.success(response))
    } else {
        res.status(404).send('Invalid request')
    }
})
