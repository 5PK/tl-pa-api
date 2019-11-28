import StreamZip from "node-stream-zip";
//import fsExtra from "fs-extra"
import fs from "fs";
import Path from "path";
import models from "../models";
import { parseDocuments } from "../libs/parse-xml-lib";
import mailService from "../config/emailConfig";
import Sequelize from "sequelize";
import axios from "axios";


export async function downloadZip(filename) {
  console.log(filename);
  try {
    const url =
      "https://patents.reedtech.com/downloads/ApplicationFullText/2019/" +
      filename +
      ".zip";
    const path = Path.resolve(__dirname, "patentFiles", filename + ".zip");
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream"
    });

    response.data.pipe(fs.createWriteStream(path));

    return new Promise((resolve, reject) => {
      response.data.on("end", () => {
        getPatents(path, filename);
        resolve();
      });

      response.data.on("error", err => {
        reject(err);
      });
    });
  } catch (error) {
    return error;
  }
}

export async function getPatents(zippath, filename) {
  console.log(1);

  const xmlPath = Path.resolve(__dirname, "patentFiles");
  console.log(2);
  const zip = new StreamZip({
    file: zippath,
    storeEntries: true
  });
  console.log(3);

  await parseDocuments(zip, xmlPath, filename);

  handleAlerts();

  console.log(4);


}

export async function handleAlerts() {

  //Clear the patentFile/ directory
  clearDirectory()

  const alerts = await models.Alert.findAll({ where });

  for (let index = 0; index < alerts.length; index++) {
    var alert = alerts[index];
    if (alert.dataValues.query != null) {
      console.log(alert.dataValues.query);
      var queryList = JSON.parse(alert.dataValues.query);

      var matched = [];

      for (let index = 0; index < queryList.length; index++) {
        var query = queryList[index];

        if (query.cpc) {
          const cpcs = await models.Cpc.findAll({
            where: {
              code: query.conditionText
            }
          });

          cpcs.forEach(cpc => {
            if (matched.indexOf(cpc.docRef) == -1) {
              matched.push(cpc.docRef);
            }
          });
        } else {
          const Op = Sequelize.Op;

          var where = {
            [Op.or]: []
          };

          console.log(query.conditionText);

          var res = query.conditionText.toString();

          if (query.title) {
            where[Op.or].push({
              title: { [Op.like]: `%${res}%` }
            });
          }

          if (query.abstract) {
            where[Op.or].push({
              abstract: { [Op.like]: `%${res}%` }
            });
          }

          if (query.spec) {
            where[Op.or].push({
              descDraw: { [Op.like]: `%${res}%` }
            });
          }

          if (query.claims) {
            where[Op.or].push({
              claims: { [Op.like]: `%${res}%` }
            });
          }

          if (query.applicant) {
            where[Op.or].push({
              applicants: { [Op.like]: `%${res}%` }
            });
          }

          if (query.inventor) {
            where[Op.or].push({
              inventors: { [Op.like]: `%${res}%` }
            });
          }

          if (query.assignee) {
            where[Op.or].push({
              assignees: { [Op.like]: `%${res}%` }
            });
          }

          console.log("where", where);

          const patents = await models.Patent.findAll({ where: where });

          console.log("found patents", patents.length);

          patents.forEach(patent => {
            if (matched.indexOf(patent.docRef) == -1) {
              matched.push(patent.docRef);
            }
          });
        }
      }

      if (matched.length > 0) {
        console.log("hello contacts", alert.dataValues.contacts);
        console.log("hello matched", matched);
        await sendAlert(alert.dataValues, matched);
      }
    }
  }

  await models.Cpc.destroy()
  await models.Patent.destroy()


  




}

async function sendAlert(alert, matched) {
  var emailBody = buildEmailBody(alert, matched);

  console.log(alert.contacts);

  var parseContacts = JSON.parse('{"arr":' + alert.contacts + "}");

  console.log(parseContacts);

  for (let index = 0; index < parseContacts.arr.length; index++) {
    const contact = await models.Contact.findAll({
      where: { id: parseContacts.arr[index] }
    });

    console.log("email", contact[0].dataValues.email);

    var mailOptions = {
      from: process.env.EMAIL_NAME,
      to: contact[0].dataValues.email,
      subject: "Patent Alert",
      html: emailBody
    };

    const sendMail = function(mailOptions){
      return new Promise(function (resolve, reject){
        mailService.sendMail(mailOptions, (err, info) => {
            if (err) {
               console.log("error: ", err);
               reject(err);
            } else {
              console.log("Message sent: %s", info.messageId, mailOptions.to);
               resolve(info);
            }
         });
      });
    }

    await sendMail(mailOptions)

  }
}

function buildEmailBody(alert, matched) {
  var body = `<h1 style="color: #5e9ca0;">These Patents have been matched from this Alert ${alert.name}!</h1><h2 style="color: #2e6c80;">Check them at the links below:</h2>
<ul>`;

  matched.forEach(element => {

    var arr = element.split('/')

    var url = `http://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PG01&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.html&r=1&f=G&l=50&s1=%${arr[1]}%22.PGNR.&OS=DN/${arr[1]}&RS=DN/${arr[1]}`
    body += `<li><a href="${url}">Application Number: ${element}</a>/en</li>`;
  });

  body += `</ul>
<h2 style="color: #2e6c80;">Not the patent's you've expected?:</h2>
<p><strong>reply to this email to get help!</strong></p>
<p><strong>&nbsp;</strong></p>`;

  return body;
}

function clearDirectory(){

  const directory = 'patentFiles';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(Path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });

}
