import uuidv4 from "uuid/v4";
import { Router } from "express";
import models, { sequelize } from "../models";
import { unauthorized, success, failure } from "../libs/response-lib";

const router = Router();

router.get("/", async (req, res) => {
  console.log("ASO: _______GET_______");

  return res.sendFile(__dirname + "/public/aso.html");
});

router.post("/", async (req, res) => {
  console.log("ASO: _______POST_______");
  console.log(req.body);

  if (await verifyRelationship(req.body.email, req.body.token)) {
    sequelize
      .transaction(t => {
        return models.AsoToken.update(
          {
            isActive: false
          },
          { where: { token: req.body.token } },
          { transaction: t }
        )
          .then(token => {
            return models.AsoToken.findOne(
              { where: { token: req.body.token } },
              { transaction: t }
            )
          }).then(token => {
            console.log(token);
            return models.Client.update(
              {
                isVerified: true,
              },
              { where: { id: token.dataValues.bx3ClientId } },
              { transaction: t }
            );


          });
      })
      .then(result => {
        return res.send(success("Verified Client!", result));
      })
      .catch(err => {
        console.log(err);
        return res.send(failure("Failed to Verify Client!", err));
      });
  } else {
    return res.send(failure("Failed to Verify!"));
  }
});

async function verifyRelationship(email, token) {
  const asoToken = await models.AsoToken.findAll({
    where: {
      email: email,
      token: token
    }
  });

  console.log(asoToken);

  if (asoToken.length === 1) {
    return true;
  } else {
    return false;
  }
}

export default router;
