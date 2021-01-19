import { Injectable } from '@nestjs/common';
const nodemailer = require('nodemailer');
require('dotenv').config();
//nodemailer configuration
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 587,
  secure: false,
  auth: {
    user: 'samadhello9812@gmail.com',
    pass: 'igsbetfxlesuxkrs',
  },
  tls: {
    rejectUnauthorized: false,
  },
});
@Injectable()
export class NodemailerService {
  constructor() {}
  sendEmail = async (req, type) => {
    // console.log('Working here')
    console.log('Password ====>', process.env.EmailPassword);
    // //console.log('Request', req)
    console.log('Name -->', req.body.email);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
      // var transporter = nodemailer.createTransport({
      //   // host: "Gmail",
      //   // port: 587,
      //   // secure: false,
      //   // requireTLS: true,
      //   // auth: {
      //   //   user: 'samadhello9812@gmail.com' ,
      //   //   pass: 'deutschland9812',
      //   // },
      //   service: 'Gmail',
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: 'samadhello9812@gmail.com',
      //     pass: process.env.EmailPassword,
      //   },
      //   tls: {
      //     rejectUnauthorized: false,
      //   },
      // });

      var mailOptions = {
        from: '',
        to: req.body.email,
        //to: 'samad@yopmail.com',
        subject: 'PHNX-Dao reason for rejection.',
        text: req.body.reasonForRejecting,
        //text: 'req.body.reasonFo=rRejectng',
        html: `
        <div style=" background-color: white" >
        <img src="cid:logo" style="
        margin-left: -9px;" alt="Pheonix Dao" width="230px"/>
        <br/>
        <h3 style="font-style: 100%" > ${
          type == 'proposalRejection'
            ? 'Your proposal has been rejected'
            : 'Your milestone has been rejected'
        }</h3>
        <hr />
        <br />
​
        <h3> To: <span>${req.body.email}</span> </h3>
        <h3> From: <span>samadhello9812@gmail.com</span> </h3>
​
        <h3>Proposal Name: <span> ${
          type == 'proposalRejection' ? req.body.proposalName : req.body.name
        } </span> </h3>
          <h3 >Reason for rejection: ${req.body.reasonForRejecting}</h3>
          <br/>
          <p>
          <hr />
          <p>Thanks, </p>
          <p>The PheonixDao Team</P>
        </div>
        `,
        attachments: [
          {
            filename: 'Logo.png',
            path: __dirname + '/assets/logo.png',
            cid: 'logo', //my mistake was putting "cid:logo@cid" here!
          },
        ],
      };

      let info = await transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log('123', error);
        } else {
          console.log('Email sent: ', info.response);
        }
      });
      console.log('check infor', info);
      return info;
    } catch (e) {
      console.log('Error ======>', e);
      throw e;
    }
  };
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
  sendTestMail = async req => {
    try {
      var mailOptions1 = {
        from: '',
        to: 'sarfarazahmedkhankhan@gmail.com',
        //to: 'samad@yopmail.com',
        subject: 'PHNX-Dao reason for rejection.',
        text: 'text',
        //text: 'req.body.reasonFo=rRejectng',
        html: `
        <div style=" background-color: white" >
        <img src="cid:logo" style="
        margin-left: -9px;" alt="Pheonix Dao" width="230px"/>
        <br/>
        <hr />
        <br />
​
        <h3> To: <span></span> </h3>
        <h3> From: <span>samadhello9812@gmail.com</span> </h3>
​
     
          <br/>
          <p>
          <hr />
          <p>Thanks, </p>
          <p>The PheonixDao Team</P>
        </div>
        `,
        attachments: [
          {
            filename: 'Logo.png',
            path: __dirname + '/assets/logo.png',
            cid: 'logo', //my mistake was putting "cid:logo@cid" here!
          },
        ],
      };
      let info = await transporter.sendMail(mailOptions1, function(
        error,
        info,
      ) {
        if (error) {
          console.log('123', error);
        } else {
          console.log('Email sent: ', info.response);
        }
      });
      console.log('check infor', info);
      return info;
      // let info = await transporter.sendMail({
      //   from: '', // sender address
      //   to: '' + `${'samad13354@gmail.com'}`, //receiver email
      //   subject: 'Telemed.App Appointment Confirmation', // Subject line
      //   html: `
      //                 <br/>
      //                 <span/><b>Appointment Time</b><br/>
      //                 </p>`,
      // });
      // const mail = {
      //   info: info,
      // };
      // console.log('check mail now', mail);
      // return mail;
    } catch (e) {
      console.log('catching error in mail==>', e);
      throw 'Email not Send';
    }
  };
}
