import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";
dotenv.config();
console.log("MAILTRAP_API:", process.env.MAILTRAP_API);

const TOKEN =process.env.MAILTRAP_API
const ENDPOINT=process.env.ENDPOINT
export const mailtrapClient = new MailtrapClient({
    endpoint:ENDPOINT,
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Abhinaw Anand",
};
// const recipients = [
//   {
//     email: "abhinawa379@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);