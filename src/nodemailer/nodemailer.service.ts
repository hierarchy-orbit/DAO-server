import { Injectable } from "@nestjs/common";
const nodemailer = require("nodemailer");
require("dotenv").config();

//nodemailer configuration

// let transporter = nodemailer.createTransport({
//   service: "Gmail",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

@Injectable()
export class NodemailerService {
  constructor() {}

  sendEmail = async (req) => {
    console.log('Request', req)
    console.log('Email -->',req.body)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
    try{
  
      var transporter = nodemailer.createTransport({
        //service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "samadhello9812@gmail.com",
          pass: "deutschland9812",
        },
      });
      
      var mailOptions = {
        from: "samadhello9812@gmail.com",
        to: req.body.email,
        //to: 'samad@yopmail.com',
        subject: "PHNX-Dao reason for rejection.",
        text: req.body.reasonForRejecting,
       //text: 'req.body.reasonFo=rRejectng',
        html:   
        `
        <div style=" background-color: white" >
        <h1 style="font-style: 100%" > PHOENIX-DAO </h1>
        <hr />
        <br />
        <h3>Proposal Name: <span> ${req.body.proposalName} </span> </h3>
          <h3 >Reason for rejecting: ${req.body.reasonForRejecting}</h3>
          <br/>
          <hr />
          <h3 >Proposal time of creation: ${req.body.createdAt} </h3>
        </div>
        `
        
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('123',error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });


    }
    catch(e){
      console.log(e)
      throw e
      
    }
  }

  //function to send invoice mail to payer
  // sendInvoiceToPayerEmail = async (invoiceData) => {
  //   try {
  //     console.log("send Invoice Mail");
  //     const code = Math.floor(Math.random() * 1000000);
  //     let info = await transporter.sendMail({
  //       from: "", // sender address
  //       to: "" + `${invoiceData.email}`, //receiver email
  //       subject: "Telemed.App Verification Code", // Subject line
  //       html: `
  //               <br/>
  //               <p>Dear ${invoiceData.name},</p>
  //               <p><span>Your Verification Code is: <b> ${code} <b/><span/></p>`,
  //     });
  //     const mail = {
  //       info: info,
  //     };
  //     return code;
  //   } catch (e) {
  //     console.log("catching error in mail==>", e);
  //     throw "Email not Send";
  //   }
  // };

  // sendMailToContactUs = async (invoiceData) => {
  //   try {
  //     let info = await transporter.sendMail({
  //       from: "", // sender address
  //       to: `telemedapp.international@gmail.com`, //receiver email
  //       subject: "Telemed.App Contact Us", // Subject line
  //       html: `
  //               <br/>
  //               <p>Name: ${invoiceData.name},</p>
  //               <p><span>Message: ${invoiceData.message}<b/><span/></p>`,
  //     });
  //     const mail = {
  //       info: info,
  //     };
  //     return mail;
  //   } catch (e) {
  //     console.log("catching error in mail==>", e.message);
  //     throw "Email not Send";
  //   }
  // };

  // Test = async () => {
  //   try {
  //     let info = await transporter.sendMail({
  //       from: "", // sender address
  //       to: "" + `${"sarfarazahmedkhankhan@gmail.com"}`, //receiver email
  //       subject: "Telemed.App report cron job Us", // Subject line
  //       html: `
  //               <br/>
  //               <p><span>Message:<b/><span/></p>`,
  //     });
  //     const mail = {
  //       info: info,
  //     };
  //     return mail;
  //   } catch (e) {
  //     console.log("catching error in mail==>", e);
  //     throw e;
  //   }
  // };

  // appointmentConfirmation = async (
  //   invoiceData,
  //   appointment_details,
  //   doctor
  // ) => {
  //   try {
  //     let info = await transporter.sendMail({
  //       from: "", // sender address
  //       to: "" + `${invoiceData.email}`, //receiver email
  //       subject: "Telemed.App Appointment Confirmation", // Subject line
  //       html: `
  //               <br/>
  //               <span/><b>Appointment Time</b><br/>
  //               ${appointment_details.date} ${appointment_details.time}<br/>
  //               <b>Doctor</b><br/>${doctor.name}
  //               <br/><br/>
  //               <p>Hi ${invoiceData.name},</p>
  //               <p><span>Here is a confirmation email that you we have scheduled your appointment with ${doctor.name} on ${appointment_details.date} at ${appointment_details.time}.<b/>
  //               </p>`,
  //     });
  //     const mail = {
  //       info: info,
  //     };
  //     return mail;
  //   } catch (e) {
  //     console.log("catching error in mail==>", e);
  //     throw e;
  //   }
  // };

  // informDoctor = async (invoiceData, appointment_details, patient) => {
  //   try {
  //     let info = await transporter.sendMail({
  //       from: "", // sender address
  //       to: "" + `${invoiceData.email}`, //receiver email
  //       subject: "Telemed.App Appointment Confirmation", // Subject line
  //       html: `
  //               <br/>
  //               <span/><b>Appointment Time</b><br/>
  //               ${appointment_details.date} ${appointment_details.time}<br/><br/>
  //               <b>Patient</b><br/>
  //               ${patient.name}<br/>
  //               <p>Hi ${invoiceData.name},</p>
  //               <p><span>Here is a confirmation email that, we have scheduled your appointment with ${patient.name} on ${appointment_details.date} at ${appointment_details.time}.<b/>
  //               </p>`,
  //     });
  //     const mail = {
  //       info: info,
  //     };
  //     return mail;
  //   } catch (e) {
  //     console.log("catching error in mail==>", e);
  //     throw e;
  //   }
  // };

  // mailToCustomMail = async (invoiceData) => {
  //   try {
  //     const resultFromPayer = await this.sendInvoiceToPayerEmail(invoiceData);
  //     return resultFromPayer;
  //   } catch (e) {
  //     console.log("catching error in mail==>", e);
  //     throw "Email not Send";
  //   }
  // };

  // contactUs = async (invoiceData) => {
  //   try {
  //     const resultFromPayer = await this.sendMailToContactUs(invoiceData);
  //     return resultFromPayer;
  //   } catch (e) {
  //     console.log("view error ", e);
  //     throw "Email not Send";
  //   }
  // };
}
