require("dotenv/config")
var cors = require("cors");
var app = require("express")();
var bodyParser = require("body-parser")
var routes = require("./routes")
var models = require("./models")
var sequelize = require("./config/dbConfig")
var pwLib = require("./libs/password-hash-lib")
var paLib = require("./libs/patent-alert-lib")
var schedule = require("node-schedule")


const PORT = process.env.PORT || process.env.SERVER_PORT;


// Then use it before your routes are set up:
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the Routes of the application
app.use("/register", routes.register);
app.use("/login", routes.login);
app.use("/client", routes.client);
app.use("/alert", routes.alert);
app.use("/contact", routes.contact);
app.use("/aso", routes.aso);
app.use("/manual", routes.manual);

app.get("/", function(req, res) {
  //when we get an http get request to the root/homepage
  res.send("Hello World");
});

// Flag for erasing db on server start
const eraseDatabaseOnSync = true;


// Schedule the Patent System
var j = schedule.scheduleJob(' * 3 * * 4', async function(){
  console.log('Today is Thursday!');
  var d = new Date();
  var filename = "ipa" + d.getFullYear().toString().substr(-2) + d.getMonth().toString() + d.getDate().toString() + ".zip"
  await downloadZip(filename)
});

// Sync and Seed
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    seedDatabase();
  }

  app.listen(PORT, () =>
    console.log(`***** Techlink-API-DEV listening on port ${PORT}! *****`)
  );
});


// Seed Database Function
const seedDatabase = async () => {
  const seed = 5;

  const hashedPassword = pwLib.generateHashPassword("Passw0rd!" + seed);

  console.log(seed);
  console.log("******  " + hashedPassword + "  ******");

  await models.User.create(
    {
      email: "1trankev@gmail.com",
      hashedPassword: hashedPassword,
      isVerified: true,
      firstName: "Kevin",
      lastName: "Tran",
      seed: seed,
      isActive:true,
      bx3_clients: [
        {
          name: "Evenica",
          aso: "JimJeffries@aso.com",
          isVerified: true,
          primaryContact: "Jack@evenica.com"
        },
        {
          name: "Contoso",
          aso: "HannibalBarca@alps.com",
          isVerified: true,
          primaryContact: "JenniferNguyen@contoso.com"
        },
        {
          name: "Google",
          aso: "Alexender@thegreat.com",
          isVerified: true,
          primaryContact: "ceo@gmail.com"
        },
        {
          name: "Microsoft",
          aso: "TimothyT@gmail.com",
          isVerified: false,
          primaryContact: "Mike@gmail.com"
        }
      ]
    },
    {
      include: [models.Client]
    }
  );

  await models.Alert.create(
    {
      name: "This is an example Alert",
      isActive: true,
      bx3ClientId: 1,
      query: `[{"conditionText":"Information","title":true,"abstract":false,"spec":false,"claims":false,"applicant":true,"inventor":true,"assignee":true,"cpc":false}]`,
      contacts:`[1, 2]`
  });
  await models.Alert.create(
    {
      name: "This is a CPC Alert",
      isActive: true,
      bx3ClientId: 1,
      query: `[{"conditionText":"Pump","title":true,"abstract":false,"spec":false,"claims":false,"applicant":false,"inventor":false,"assignee":false,"cpc":false}]`,
      contacts:`[1, 2]`
    },
    {
      include: [models.Client]
    }
  );
  await models.Alert.create(
    {
      name: "This is a CPC Alert Too!",
      isActive: true,
      bx3ClientId: 1,
      query: `[{"conditionText":"Information","title":true,"abstract":false,"spec":false,"claims":false,"applicant":false,"inventor":false,"assignee":false,"cpc":false}]`,
      contacts:`[1, 2]`
    },
    {
      include: [models.Client]
    }
  );
  await models.Alert.create(
    {
      name: "This is a Disabled Alert",
      isActive: false,
      bx3ClientId: 1,
      query: `[{"conditionText":"Steam","title":false,"abstract":false,"spec":false,"claims":false,"applicant":false,"inventor":false,"assignee":false,"cpc":true}]`,
      contacts:`[1, 2]`
    },
    {
      include: [models.Client]
    }
  );

  await models.Contact.create({
    firstName: "Esteve",
    lastName: "Jones",
    email: "1trankev@gmail.com",
    bx3ClientId: 1
  });
  await models.Contact.create(
    {
      firstName: "Nityan",
      lastName: "Theman",
      email: "1trankev@gmail.com",
      bx3ClientId: 1
    },
    {
      include: [models.Client]
    }
  );
};
