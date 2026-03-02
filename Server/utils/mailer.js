import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendmail = async (to, subject, text) => {
  const msg = {
    to,
    from: process.env.MAIL_FROM, // must match your verified sender in SendGrid
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  }
    catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("SendGrid response error:", error.response.body || error.response);
    }

}};

export default sendmail;
