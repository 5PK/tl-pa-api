const parseString = require("xml2js").parseString;
var fs = require("fs");
const readline = require("readline");
const Path = require("path");
const models = require("../models");
var ScuttleZanetti = require("scuttlezanetti").api;
var stopWords = require("scuttlezanetti").stopWords;

function parseDocuments(zip, xmlPath, filename) {
  return new Promise((resolve, reject) => {
    try {
      //Unzips file to disk
      zip.on("ready", () => {
        zip.extract(null, xmlPath, err => {
          console.log(err ? "Extract error" : "Extracted");
          zip.close();

          //declare new xml path
          const xmlPath2 = Path.resolve(
            __dirname,
            "patentFiles",
            filename + ".xml"
          );

          //send the file into a stream
          const rl = readline.createInterface({
            input: fs.createReadStream(xmlPath2),
            crlfDelay: Infinity
          });

          var docNo = 0;
          var xmlDoc = "";

          //Build the XML
          rl.on("line", line => {
            // For splitting the stream on
            if (line.startsWith("<?xml")) {
              docNo += 1;
              console.log("*****************************START");
              console.log(docNo);

              xmlDoc += line;
            } else if (line.startsWith("</us-patent")) {
              xmlDoc += line;

              // Convert XML to JSON and add to database
              parseString(xmlDoc, function(err, patent) {
                addPatentToDb(patent);

                //reset the xmlDoc
                xmlDoc = "";
              });
            } else {
              xmlDoc += line;
            }
          });

          rl.on("close", function() {
            resolve(true);
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getInventors(arr) {
  var rt = "";

  arr.forEach(element => {
    var fname = element.addressbook[0]["first-name"][0];
    var lname = element.addressbook[0]["last-name"][0];
    var inventor = { name: fname + " " + lname };
    rt += fname + " " + lname + " ";
  });

  return rt;
}

function getApplicants(arr) {
  var rt = " ";

  arr.forEach(element => {
    if ("first-name" in element["us-applicant"][0].addressbook[0]) {
      rt += element["us-applicant"][0].addressbook[0]["first-name"][0] + " ";
    }

    if ("last-name" in element["us-applicant"][0].addressbook[0]) {
      rt += element["us-applicant"][0].addressbook[0]["last-name"][0] + " ";
    }
    if ("orgname" in element["us-applicant"][0].addressbook[0]) {
      rt += orgname =
        element["us-applicant"][0].addressbook[0].orgname[0] + " ";
    }
  });

  return rt;
}

function getAssignees(arr) {
  var rt = " ";

  arr.forEach(element => {
    if ("addressbook" in element.assignee[0]) {
      if ("first-name" in element.assignee[0].addressbook[0]) {
        rt += element.assignee[0].addressbook[0]["first-name"][0];
      }

      if ("last-name" in element.assignee[0].addressbook[0]) {
        rt += element.assignee[0].addressbook[0]["last-name"][0];
      }
      if ("orgname" in element.assignee[0].addressbook[0]) {
        rt += element.assignee[0].addressbook[0].orgname[0];
      }
    }
  });

  return rt;
}

function getClaims(result) {
  if ("claims" in result["us-patent-application"]) {
    var claimArr = result["us-patent-application"].claims[0].claim;

    var claims = "";

    var sz = new ScuttleZanetti({
      stopWords: stopWords, //default
      tokenizePattern: undefined, //default
      tokenizeMethod: function(s) {
        return s.replace(/[^\w\s-]/, "").split(" ");
      } //default
    });

    claimArr.forEach(claim => {
      if (typeof claim == "string" && claim != "") {
        claims += sz.removeStopWords(claim);
      } else {
        if (typeof claim["claim-text"][0] == "string") {
          claims += sz.removeStopWords(claim["claim-text"][0]);
        } else {
          if ("_" in claim["claim-text"][0]) {
            var trimTitle = claim["claim-text"][0]._;
            trimTitle = trimTitle.trim();
            claims += sz.removeStopWords(trimTitle);
          }
          if ("claim-text" in claim["claim-text"][0]) {
            if (typeof claim["claim-text"][0]["claim-text"][0] == "string") {
              claims += sz.removeStopWords(
                claim["claim-text"][0]["claim-text"][0]
              );
            } else {
              if ("i" in claim["claim-text"][0]["claim-text"][0]) {
                claims += sz.removeStopWords(
                  claim["claim-text"][0]["claim-text"][0].i[0]
                );

                claim["claim-text"][0]["claim-text"].forEach(
                  (element, index) => {
                    if (index > 0) {
                      console.log(element);
                      if (typeof element == "string") {
                        claims += sz.removeStopWords(element);
                      } else {
                        if ("_" in element) {
                          claims += sz.removeStopWords(element._);
                        }

                        if ("i" in element) {
                          claims += sz.removeStopWords(element.i[0]);
                        }
                      }
                    }
                  }
                );
              } else {
                claims += sz.removeStopWords(
                  claim["claim-text"][0]["claim-text"][0]._
                );

                if ("claim-text" in claim["claim-text"][0]["claim-text"][0]) {
                  claim["claim-text"][0]["claim-text"][0]["claim-text"].forEach(
                    claimEle => {
                      if (typeof claimEle == "string") {
                        claims += sz.removeStopWords(claimEle);
                      } else {
                        claims += sz.removeStopWords(claimEle._);

                        if ("claim-text" in claimEle) {
                          claimEle["claim-text"].forEach(claimEleEle => {
                            if (typeof claimEle == "string") {
                              claims += sz.removeStopWords(claimEle);
                            } else {
                              console.log("claimELELE");
                            }
                          });
                        }
                      }
                    }
                  );
                }
              }
            }
          }
        }
      }
    });
  }

  return claims;
}

function getDescDraw(result) {
  /*
    console.log(result["us-patent-application"].drawings)
    console.log(result["us-patent-application"].drawings[0].figure[0].img[0])
    console.log(result["us-patent-application"].description)
    */

  var description = "";

  var sz = new ScuttleZanetti({
    stopWords: stopWords, //default
    tokenizePattern: undefined, //default
    tokenizeMethod: function(s) {
      return s.replace(/[^\w\s-]/, "").split(" ");
    } //default
  });

  result["us-patent-application"].description[0].p.forEach(element => {
    if ("maths" in element) {
      console.log("to be included? -> ask Steve");
    } else {
      if ("_" in element) {
        description += sz.removeStopWords(element._);
      }
    }
  });

  return description;
}

async function addPatentToDb(result) {
  //return new Promise((resolve, reject) => {
  try {
    if ("us-patent-application" in result) {
      var doc =
        result["us-patent-application"]["us-bibliographic-data-application"][0];
      var docInfo = doc["publication-reference"][0]["document-id"][0];
      var appid =
        docInfo["country"] +
        "/" +
        docInfo["doc-number"] +
        "/" +
        docInfo["kind"];

      console.log("applicationid", appid);

      var title = doc["invention-title"][0]._;

      var abstract = result["us-patent-application"].abstract[0].p[0]._;

      var inventors = getInventors(doc["us-parties"][0].inventors[0].inventor);

      var applicants = getApplicants(doc["us-parties"][0]["us-applicants"]);

      var assignees;
      if ("assignees" in doc) {
        assignees = getAssignees(doc.assignees);
      } else {
        assignees = null;
      }

      var mainCpc = null;
      var cpcArr = [];
      if ("classifications-cpc" in doc) {
        mainCpc =
          doc["classifications-cpc"][0]["main-cpc"][0]["classification-cpc"];

        if ("further-cpc" in doc["classifications-cpc"][0]) {
          cpcArr =
            doc["classifications-cpc"][0]["further-cpc"][0][
              "classification-cpc"
            ];
        }
      } else {
        mainCpc = null;
      }

      var claims = getClaims(result).replace("\r\n", "");
      var descDraw = getDescDraw(result);

      var patent = {
        docRef: appid,
        title: title,
        abstract: abstract,
        inventors: inventors,
        applicants: applicants,
        assignees: assignees,
        claims: claims,
        descDraw: descDraw
      };

      var newpatent = await models.Patent.create(patent);

      if (mainCpc !== null) {
        cpcArr.push(mainCpc[0]);

        if (cpcArr.length > 0) {
          for (let i = 0; i < cpcArr.length; i++) {
            cpcArr[i] = {
              code:
                cpcArr[i].section[0] +
                cpcArr[i].class[0] +
                cpcArr[i].subclass[0] +
                cpcArr[i]["main-group"][0],
              bx3PatentId: newpatent.dataValues.id,
              docRef: appid
            };
          }
        }
      }

      models.Cpc.bulkCreate(cpcArr).then(() => {
        return true;
      });
    } else {
      return true;
    }
  } catch (error) {
    return error;
  }
  //});
}

module.exports = parseDocuments