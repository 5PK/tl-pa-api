import mailService from "../config/emailConfig";

export async function sendAsoEmail(email, token) {
  var mailOptions = {
    from: process.env.EMAIL_NAME,
    to: email,
    subject: "Authenticate as an ASO",
    html: `<h1>Authenticate as an ASO</h1><p>click on the link to authenticate this user, and enter you email and this code: ${token} localhost:6969/aso www.google.ca </p> `
  };

  console.log(mailOptions)

  await mailService.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return ({ error: true, data: error });
    }
    else {
      console.log("Email sent: " + info.response);
      return ({ error: false, data: info.response });
    }
  });
}

