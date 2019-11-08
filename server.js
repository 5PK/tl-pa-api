import "dotenv/config"
import cors from 'cors'
import express from "express"
import bodyParser from "body-parser"
import routes from "./routes"
import models, { sequelize } from './models'
import { createSeed, generateHashPassword } from "./libs/password-hash-lib" 
import { downloadZip } from "./libs/patent-alert-lib"
import schedule from 'node-schedule'

const PORT = process.env.SERVER_PORT || 3000;

const app = express()

// Then use it before your routes are set up:
app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//app.use('/session', routes.session);
app.use("/register", routes.register)
app.use("/login", routes.login)
app.use("/client", routes.client)
app.use('/alert', routes.alert);

app.get("/", function(req, res) {
  //when we get an http get request to the root/homepage
  res.send("Hello World");
});

const eraseDatabaseOnSync = true;



//var j = schedule.scheduleJob('*/1 * * * *', function(){
//  downloadZip()
//  console.log('Today is recognized by Kevin Tran!');
//});


sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
    if (eraseDatabaseOnSync) {
      createUsersWithClients()
    }

    app.listen(PORT, () =>
        console.log(`***** Techlink-API-DEV listening on port ${PORT}! *****`),
    );
});

const createUsersWithClients = async () => {

  const seed = 5
  
  const hashedPassword = generateHashPassword("Passw0rd!" + seed)

  console.log(seed)
  console.log("******  " + hashedPassword + "  ******")


  await models.User.create(
    {
      email: "1trankev@gmail.com",
      hashedPassword: hashedPassword,
      isVerified: true,
      firstName: "Kevin",
      lastName: "Tran",
      seed: seed,
      bx3_clients: [
        {
          name: "Evenica",
          aso: "testASO@aso.com",
          isVerified: true,
          primaryContact: "contact@contact.contact"
  
        },
        {
          name: "Contoso",
          aso: "testASO@Contoso.com",
          isVerified: true,
          primaryContact: "contact@contact.contact"
        },
        {
          name: "Google",
          aso: "testASO@Google.com",
          isVerified: true,
          primaryContact: "contact@contact.contact"
        },
        {
          name: "Mircrosoft",
          aso: "testASO@Mircrosoft.com",
          isVerified: true,
          primaryContact: "contact@contact.contact",

        }
      ]
    },
    {
      include: [models.Client]
    }
  )

  await models.Alert.create(
  {
    name: "alert1",
    contacts: "contact1",
    isActive: true,
    bx3ClientId: 1
  },

)
  await models.Alert.create(
    {
      name: "alert2",
      contacts: "contact1",
      isActive: true,
      bx3ClientId: 1
    },
    {
      include: [models.Client]
    }
  )



}
