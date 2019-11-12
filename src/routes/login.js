import { Router } from "express";
import jwt from "jsonwebtoken";
import { unauthorized, success, failure } from "../libs/response-lib";
import {
  generateHashPassword,
  verifyHashPassword
} from "../libs/password-hash-lib";
import models from "../models";

const router = Router();

router.post("/", async (req, res) => {

  console.log("login attempt")
  console.log(req.body.email)

  if(req.body.email == null || req.body.password == null){
    return res.send(
      failure(
        "undefined values"
      ))
  }

  const result = await models.User.findAll({
    where: {
      email: req.body.email
    }
  });

  if (result === null || result.length == !1) {

    return res.send(
      failure(
        "User not Found! If this is an unexpected error, contact the sys-admin"
      )
    );
  } else {
    const user = result[0].dataValues;

    if (
      !verifyHashPassword(req.body.password + user.seed, user.hashedPassword)
    ) {
      return res.send(unauthorized("Password Incorrect!"));
    } else {
      const jwtBody = {
        email: user.email,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      };

      const token = jwt.sign(jwtBody, process.env.JWT_SECRET, {
        expiresIn: "7d"
      });

      const response = {
        status: "authenticated",
        token: token
      };

      // Count tokens in db
      const tokenCount = await models.Token.count({ where: { token: token } });

      // If no tokens, create one
      if (tokenCount == 0) {
        await createToken(user.id);
        return res.send(success("User Login Success!", response));

        // If token exists,
      } else if (tokenCount == 1) {
        await updateToken(user.id);
        return res.send(success("User Login Success!", response));
      } else {
        return res.send(unauthorized("unauthorized"));
      }
    }
  }
});

const createToken = async id => {
  //TODO: TRY CATCH
  const token = await models.Token.create({
    status: "authenticated",
    token: token,
    userId: id
  });
};

const updateToken = async id => {
  // TODO: TRY CATCH
  const token = await models.Token.update(
    {
      status: "authenticated",
      token: token,
      userId: id
    },
    { where: { token: token } }
  );
};

export default router;
