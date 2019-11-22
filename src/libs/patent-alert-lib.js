const Fs = require("fs");
const Axios = require("axios");
const Path = require("path");
const AdmZip = require("adm-zip");
const parseString = require("xml2js").parseString;

export async function downloadZip() {
  //console.log("start zip download")

  // TODO: dynamic URL to get date each week

  /*

    const url = 'https://patentscur.reedtech.com/downloads/PatentAssignmentText/2019/ad20191023.zip'
    const path = Path.resolve(__dirname, 'patentFiles', 'ad20191023.zip')
    console.log(path)

    const response = await Axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    })

    response.data.pipe(Fs.createWriteStream(path))

    */

  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      console.log("resolve");

      var zip = new AdmZip(path);
      var zipEntries = zip.getEntries(); // an array of ZipEntry records, in this case there's just one entry.

      zipEntries.forEach(function(zipEntry) {
        console.log(zipEntry.entryName); // outputs zip entries information
        if (zipEntry.entryName == "ipa191017.xml") {
          var xml = zipEntry.getData().toString("utf8");

          parseString(xml, function(err, result) {
            var obj = result;
            //var patentArr = obj["us-patent-assignments"]["patent-assignments"][0]["patent-assignment"]

            console.log("******************");
          });
        }
      });

      resolve();
    });

    response.data.on("error", err => {
      reject(err);
    });
  });
}

export async function downloadZip2() {
  const path = Path.resolve(__dirname, "patentFiles", "ipa19017.zip");
  var zip = new AdmZip(path);
  var zipEntries = zip.getEntries(); // an array of ZipEntry records, in this case there's just one entry.

  zipEntries.forEach(function(zipEntry) {
    console.log(zipEntry.entryName); // outputs zip entries information
    if (zipEntry.entryName == "ipa19017.xml") {
      console.log("here at least");
      var xml = zipEntry.getData().toString("utf8");

      var splitXml = xml.split("<?xml");

      /*
      parseString("<?xml " + splitXml[14], function(err, result) {
        printPatent(result);
      });

      

      for (var i = 1; i < 20; i++) {
        parseString("<?xml " + splitXml[i], function(err, result) {
          printPatent(result);
        });
      }
      */

      
      splitXml.forEach(async element => {
        parseString("<?xml " + element, function(err, result) {
          printPatent(result);
        });
      });
      
    }
  });
}

function getInventors(arr) {
  var rtArr = [];

  arr.forEach(element => {
    var fname = element.addressbook[0]["first-name"][0];
    var lname = element.addressbook[0]["last-name"][0];
    var inventor = { name: fname + " " + lname };
    rtArr.push(inventor);
  });

  return rtArr;
}

function getApplicants(arr) {
  var rtArr = [];

  arr.forEach(element => {
    if ("first-name" in element["us-applicant"][0].addressbook[0]) {
      var fname = element["us-applicant"][0].addressbook[0]["first-name"][0];
    }

    if ("last-name" in element["us-applicant"][0].addressbook[0]) {
      var lname = element["us-applicant"][0].addressbook[0]["last-name"][0];
    }
    if ("orgname" in element["us-applicant"][0].addressbook[0]) {
      var orgname = element["us-applicant"][0].addressbook[0].orgname[0];
    }
    var applicant = { name: fname + lname, orgname: orgname };
    rtArr.push(applicant);
  });

  return rtArr;
}

function getAssignees(arr) {
  var rtArr = [];

  arr.forEach(element => {
    if ("first-name" in element.assignee[0].addressbook[0]) {
      var fname = element.assignee[0].addressbook[0]["first-name"][0];
    }

    if ("last-name" in element.assignee[0].addressbook[0]) {
      var lname = element.assignee[0].addressbook[0]["last-name"][0];
    }
    if ("orgname" in element.assignee[0].addressbook[0]) {
      var orgname = element.assignee[0].addressbook[0].orgname[0];
    }
    var applicant = { name: fname + lname, orgname: orgname };
    rtArr.push(applicant);
  });

  return rtArr;
}

function getClaims(result) {

    var claimStatement = result["us-patent-application"]['us-claim-statement'][0]

    console.log(claimStatement)

    var claimArr = result["us-patent-application"].claims[0].claim

    console.log(claimArr)

   
    var rtArr = [];

    claimArr.forEach(claim => {
        console.log(claim['claim-text'][0].b)
        console.log(claim['claim-text'][0]['claim-ref'])

        //console.log(claim)
        
    }); 

    return rtArr
}

function printPatent(result) {
  console.log(result["us-patent-application"]);
  console.log("************************************");

  // TITLE
  console.log(
    "\n" +
      "TITLE: " +
      result["us-patent-application"]["us-bibliographic-data-application"][0][
        "invention-title"
      ][0]._ +
      "\n"
  );

  // ABSTRACT
  console.log(
    "ABSTRACT: " + result["us-patent-application"].abstract[0].p[0]._ + "\n"
  );

  // INVENTORS
  console.log("INVENTORS: ");
  var inventors = getInventors(
    result["us-patent-application"]["us-bibliographic-data-application"][0][
      "us-parties"
    ][0].inventors[0].inventor
  );
  console.log(inventors);

  // APPLICANTS
  console.log("APPLICANTS: ");
  var applicants = getApplicants(
    result["us-patent-application"]["us-bibliographic-data-application"][0][
      "us-parties"
    ][0]["us-applicants"]
  );
  console.log(applicants);

  // ASSIGNEES
  console.log("ASSIGNEES: ");
  if (
    "assignees" in
    result["us-patent-application"]["us-bibliographic-data-application"][0]
  ) {
    var assignees = getAssignees(
      result["us-patent-application"]["us-bibliographic-data-application"][0]
        .assignees
    );
    console.log(assignees);
  } else {
    console.log("ASSIGNEES: null ");
  }

  //main CPC
  console.log("MAIN CPC: ");
  console.log(
    result["us-patent-application"]["us-bibliographic-data-application"][0][
      "classifications-cpc"
    ][0]["main-cpc"][0]["classification-cpc"]
  );

  //Further CPC
  /*
  console.log("Further CPC: ");
  console.log(
    result["us-patent-application"]["us-bibliographic-data-application"][0][
      "classifications-cpc"
    ][0]["further-cpc"][0]['classification-cpc']
  );
  */

  // CLAIMS

  /*
  console.log("CLAIMS");
  var claims = getClaims(result);
  console.log(claims);
  */

  /*
        console.log('************************************')

        console.log('____________________')
        
        console.log(result['us-patent-application'])
        
        console.log('____________________')
        
        console.log(result['us-patent-application']['us-bibliographic-data-application'][0]['$'])
        */
}
