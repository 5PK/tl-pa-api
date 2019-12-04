import { Router } from "express";
import { success, failure } from "../libs/response-lib";
import { createSeed, generateHashPassword } from "../libs/password-hash-lib";
import { sendRegEmail } from "../libs/email-lib";
import models, { sequelize } from "../models";

const router = Router();

router.post("/", async (req, res) => {

  const seed = createSeed();
  const hashedPassword = generateHashPassword(req.body.password + seed);
  
  /*
  TODO: 
  1.ADD CHECK FOR USER EXISTS
  2.EMAIL/PASSVALIDATION?
  */

  sequelize
    .transaction(t => {
      return models.User.create(
        {
          email: req.body.email,
          firstName: " ",
          lastName: " ",
          hashedPassword: hashedPassword,
          seed: seed
        },
        { transaction: t }
      )
        .then(user => {
          console.log(user.dataValues.id);
          return models.RegToken.create(
            {
              token: makeid(5),
              isActive: true,
              bx3UserId: user.dataValues.id
            },
            { transaction: t }
          );
        })
        .then(regToken => {
          console.log(regToken);
          var data = {
            code: regToken.dataValues.token
          };

          const emailRes = sendRegEmail(req.body.email, data);
          console.log("email response", emailRes);
          if (emailRes.error) {
            throw new Error();
          }
        });
    })
    .then(async result => {
      return res.send(success("Added User!", result));
    })
    .catch(err => {
      console.log(err);
      return res.send(failure("Failed to add User!", err));
    });

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
});

router.post("/confirm", async (req, res) => {
  if (await verifyCode(req.body.code)) {
    sequelize
      .transaction(t => {
        return models.RegToken.update(
          {
            isActive: false
          },
          { where: { token: req.body.code } },
          { transaction: t }
        )
          .then(token => {
            return models.RegToken.findOne(
              { where: { token: req.body.code } },
              { transaction: t }
            );
          })
          .then(token => {
            console.log(token);
            return models.User.update(
              {
                isActive: true
              },
              { where: { id: token.dataValues.bx3UserId } },
              { transaction: t }
            );
          });
      })
      .then(result => {
        return res.send(success("Verified User!", result));
      })
      .catch(err => {
        console.log(err);
        return res.send(failure("Failed to Verify User!", err));
      });
  } else {
    return res.send(failure("Failed to Verify!"));
  }
});

async function verifyCode(code) {
  const regToken = await models.RegToken.findAll({
    where: {
      token: code
    }
  });

  console.log(regToken);

  if (regToken.length === 1) {
    return true;
  } else {
    return false;
  }
}

export default router;
