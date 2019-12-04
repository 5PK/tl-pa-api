import mailService from "../config/emailConfig";

export async function sendAsoEmail(email, data) {
  var mailOptions = {
    from: process.env.EMAIL_NAME,
    to: email,
    subject: "Authenticate as an ASO",
    html: `<h1>Authenticate this Relationship</h1>
    <h2 style="color: #2e6c80;">${data.clientName} and ${data.agentName}:</h2>
    <p>Please access the verification portal at the link below and verify the relationship as an ASO.</p>
    <p>&nbsp;</p>
    <p>Your code: <span style="background-color: #2b2301; color: #fff; display: inline-block; padding: 3px 10px; font-weight: bold; border-radius: 5px;">${data.code}</span></p>
    <p>Verification Portal:&nbsp; <span style="background-color: #2b2301; color: #fff; display: inline-block; padding: 3px 10px; font-weight: bold; border-radius: 5px;">${data.portal}</span></p>
    <h2 style="color: #2e6c80;">&nbsp;</h2>
    <h3 style="color: #2e6c80;">This is an automated message! Please do not reply.</h3>
    <p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p>
    <p><strong>&nbsp;</strong></p>
    <p><strong>&nbsp;</strong></p>`
  };

  console.log(mailOptions)

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

  return await sendMail(mailOptions)

   


}

export async function sendRegEmail(email, data) {
  var mailOptions = {
    from: process.env.EMAIL_NAME,
    to: email,
    subject: "Patent Alert Registration Code",
    html: `<h1>Hi, here is your registration code!</h1>
    <p>Please use the code below to verify your email!</p>
    <p>&nbsp;</p>
    <p>Your code: <span style="background-color: #2b2301; color: #fff; display: inline-block; padding: 3px 10px; font-weight: bold; border-radius: 5px;">${data.code}</span></p>
    <h2 style="color: #2e6c80;">&nbsp;</h2>
    <h3 style="color: #2e6c80;">This is an automated message! Please do not reply.</h3>
    <p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p>
    <p><strong>&nbsp;</strong></p>
    <p><strong>&nbsp;</strong></p>`
  };

  console.log(mailOptions)

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

  return await sendMail(mailOptions)

   


}

