const express = require("express");
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const csurf = require('csurf');
const winston = require('winston')
dotenv.config({ path: './.env' });

const app = express.Router()

const csrfProtection = csurf({ cookie: true });

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'logs.log' }),
    ],
  });

app.post('/checkout', csrfProtection, async (req, res) => {
    const { cartItems, totalAmount } = req.body;
    console.log(cartItems, totalAmount)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure:true,
      logger:true,
      secureConnection:false,
      auth: {
        user: process.env.EMAIL,
        pass: 'fcbu llco dawt nydv',
      },
      tls:{
        rejectUnauthorized:true
      }
    });
  
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString();
    const mailOptions = {
      from: process.env.EMAIL,
      to: 'cuong.dm214948@sis.hust.edu.vn',
      subject: 'Order Payment Confirmation',
      text: `Dear Customer [name] ,
  
  We are pleased to inform you that your payment for Order #001 has been successfully processed.
  
  Thank you for your purchase! Your order is now being prepared for shipment, and you will receive a notification with tracking details once your order has been dispatched.
  
  Here are the details of your transaction:
  
  Order Number: 001
  Order Date:  ${dateString} ${timeString}
  Payment Amount: ${totalAmount}K
  Payment Method: VNPay
  
  If you have any questions or need further assistance, please do not hesitate to contact our customer support team at [Customer Support Email] or [Customer Support Phone Number].
  
  Thanks for shopping with our store!
  
  Best regards,
  
  TASTY FOOD ORDER
  NO.1 DAI CO VIET
  cuong.dm214948@sis.hust.edu.vn
  0397825923`,
  attachments: [
    {
      filename: 'cartItems.json',
      content: JSON.stringify(cartItems, null, 2) // Convert cartItems to JSON string with 2-space indentation
    }
  ]
    };
  
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    logger.info('User' ,{},"ordered successfully", { timestamp: new Date().toISOString() });
    return res.json({ status: 'Success', message: 'Order processed successfully' });
  });


module.exports = app;