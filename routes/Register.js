import { Router } from "express";
import bodyParse from "body-parser";
import buildResponse from "../libs/response-lib" 
import { createSeed, generateHashPassword } from "../libs/password-hash-lib" 

const router = Router();

router.post("/", async (req, res) => {

  const seed = createSeed();
  const hashedPassword = generateHashPassword(password + seed);

  /*
  TODO: 
  1.ADD CHECK FOR USER EXISTS
  2.EMAIL/PASSVALIDATION?
  */

  const user = await req.context.models.User.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastname,
    hashedPassword: hashedPassword,
    seed: seed
  });

  res.send(buildResponse.created(body));


  /*
  const query = `INSERT INTO user_tb (email, hashedPassword, isVerified, seed) VALUES ('${email}', '${hashedPassword}', ${isVerified}, '${seed}')`;
  pool.query(query, (err, results, fields) => {
    if (err) {
      res.send(buildResponse.failure({ data: null, message: err.message }));
    }

    const { insertId } = results;

    console.log(results);

    const client = { id: insertId, name, aso, primaryContact, isVerified };

    const body = {
      data: client,
      message: `user ${name} successfully registered.`
    };
    res.send(buildResponse.created(body));
  });
  */
});

export default router;
