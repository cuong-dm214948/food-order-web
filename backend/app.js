const express = require("express");
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const winston = require('winston');

dotenv.config({ path: './.env' });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['POST', 'GET'],
  credentials: true,
}));

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next) => {
  console.log('CSRF Token:', req.csrfToken());
  next();
});

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const authMiddleware = (req, res, next) => {
  const token = req.cookies['access-token'];
  if (!token) {
    return res.status(401).json({ Error: "No token provided" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ Error: "Invalid token" });
    } else {
      req.username = decoded.username;
      req.userType = decoded.userType;
      next();
    }
  });
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs.log' }),
  ],
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL connected...");
  }
});

const saltRounds = 10;

const validateCaptcha = async (captchaToken) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('reCAPTCHA secret key is not set.');
    return false;
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
  
  try {
    const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
    const recaptchaJson = await recaptchaRes.json();
    return recaptchaJson.success;
  } catch (err) {
    console.error('Error validating CAPTCHA', err);
    return false;
  }
};

app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/register', async (req, res) => {
  const captchaValid = await validateCaptcha(req.body.captchaToken);
  if (!captchaValid) {
    return res.status(400).send({ Error: 'Invalid CAPTCHA' });
  }

  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?,?)";

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return res.status(500).send("Internal server error");
    }
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      if (err) {
        return res.status(500).send("Internal server error");
      }
      const values = [req.body.username, hash, "user"];
      db.query(sql, values, (err, result) => {
        if (err) {
          return res.status(500).send("Internal server error");
        }
        res.send({ Status: "Success" });
      });
    });
  });
});

let refreshTokens = [];

app.post('/login', csrfProtection, async (req, res) => {
  const captchaValid = await validateCaptcha(req.body.captchaToken);
  if (!captchaValid) {
    return res.status(400).send({ Error: 'Invalid CAPTCHA' });
  }

  const sentusername = req.body.username;
  const values = [sentusername];
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [req.body.username], (err, results) => {
    if (err) {
      return res.json({ Error: err });
    }
    if (results.length > 0) {
      bcrypt.compare(req.body.password.toString(), results[0].password, (err, response) => {
        if (err) { 
          return res.json({ Error: "Invalid username or password" });
        }
        if (response) {
          const username = results[0].username;
          const userType = results[0].role;
          logger.info(`User ${username} has logged in successfully.`);
          const token = jwt.sign({ username, userType }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
          const refreshToken = jwt.sign({ username, userType }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '25200s' });
          refreshTokens.push(refreshToken);
          res.cookie('access-token', token, { httpOnly: true, secure: true, sameSite: 'none' });
          return res.json({ Status: "Success", token, refreshToken });
        } else {
          return res.json({ Error: "Invalid username or password" });
        }
      });
    } else {
      return res.json({ Error: "Login failed. Invalid username or password" });
    }
  });
});

app.post('/token', csrfProtection, (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign({ username: user.username, userType: user.userType }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    res.json({ accessToken });
  });
});

app.post('/checkout', csrfProtection, async (req, res) => {
  const { cartItems, totalAmount, captchaToken } = req.body;
  
  const isCaptchaValid = await validateCaptcha(captchaToken);
  if (!isCaptchaValid) {
    return res.status(400).json({ status: 'Error', message: 'Invalid CAPTCHA' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@example.com',
    subject: 'Order Payment Confirmation',
    text: `Dear Customer,

We are pleased to inform you that your payment for Order #001 has been successfully processed.

Thank you for your purchase! Your order is now being prepared for shipment, and you will receive a notification with tracking details once your order has been dispatched.

Here are the details of your transaction:

Order Number: 001
Order Date: ${new Date().toLocaleDateString()}
Payment Amount: ${totalAmount}
Payment Method: vnpay

If you have any questions or need further assistance, please do not hesitate to contact our customer support team.

Thank you for shopping with us!

Best regards,

TASTY FOOD ORDER`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  return res.json({ status: 'Success', message: 'Order processed successfully' });
});

app.post('/logout', csrfProtection, (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.send("Logout successful");
});

app.get('/logout', authMiddleware, (req, res) => {
  res.clearCookie('access-token');
  return res.json({ Status: "Success" });
});

app.post('/profile', csrfProtection, authMiddleware, (req, res) => {
  const { fullName, mobileNo, email, address } = req.body;
  const username = req.username;

  if (!/^[A-Za-z\s]+$/.test(fullName)) {
    return res.status(400).json({ Error: 'Full name should contain only alphabets and spaces.' });
  }
  if (!/^\d{10}$/.test(mobileNo)) {
    return res.status(400).json({ Error: 'Mobile number should contain exactly 10 digits.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ Error: 'Email is invalid.' });
  }
  if (!/\d/.test(address) || !/[A-Za-z]/.test(address)) {
    return res.status(400).json({ Error: 'Address should contain both numbers and text.' });
  }

  const sql = "UPDATE users SET fullName = ?, mobileNo = ?, email = ?, address = ? WHERE username = ?";
  db.query(sql, [fullName, mobileNo, email, address, username], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: 'Internal server error' });
    }
    return res.json({ Status: 'Profile updated successfully' });
  });
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
