const express = require("express");
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const fetch = require('node-fetch');
const  nodemailer = require('nodemailer');
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
    logger.warn('No token provided', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(401).json({ Error: "No token provided" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      logger.warn('Invalid token', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
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

app.get('/', authMiddleware, (req, res) => {
  logger.info('Accessed root route', { username: req.username, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
  return res.json({ Status: "Success", username: req.username, userType: req.userType });
});

db.connect((error) => {
  if (error) {
    logger.error('MySQL connection error', { error, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    console.log(error);
  } else {
    logger.info('MySQL connected', { timestamp: new Date().toISOString() });
    console.log("MySQL connected...");
  }
});

const saltRounds = 10;

const validateCaptcha = async (captchaToken) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    logger.error('reCAPTCHA secret key is not set.', { timestamp: new Date().toISOString() });
    return false;
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
  
  try {
    const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
    const recaptchaJson = await recaptchaRes.json();
    return recaptchaJson.success;
  } catch (err) {
    logger.error('Error validating CAPTCHA', { error: err, timestamp: new Date().toISOString() });
    return false;
  }
};

app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const USER_REGEX = /^[a-z0-9]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$&*()]).{8,24}$/;

app.post('/register', async (req, res) => {
  const captchaValid = await validateCaptcha(req.body.captchaToken);
  if (!captchaValid) {
    logger.warn('Invalid CAPTCHA during registration', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(400).send({ Error: 'Invalid CAPTCHA' });
  }

  if (!USER_REGEX.test(req.body.username)) {
    logger.warn('Invalid username format during registration', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(400).json({ Error: 'Username should contain only alphabets and number.' });
  }

  if (!PWD_REGEX.test(req.body.password)) {
    logger.warn('Invalid password format during registration', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(400).json({ Error: 'Password should contain alphabets, special characters, and numbers.' });
  }

  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      logger.error('Error generating salt', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.status(500).send("Internal server error");
    }
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      if (err) {
        logger.error('Error hashing password', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
        return res.status(500).send("Internal server error");
      }
      const values = [req.body.username, hash, 'user'];
      db.query(sql, values, (err, result) => {
        if (err) {
          logger.error('Database error during registration', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
          return res.status(500).send("Internal server error");
        }
        logger.info(`User ${req.body.username} registered successfully`, { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
        res.send({ Status: "Success" });
      });
    });
  });
});


let refreshTokens = [];

app.post('/login', csrfProtection, async (req, res) => {
  const captchaValid = await validateCaptcha(req.body.captchaToken);
  if (!captchaValid) {
    logger.warn('Invalid CAPTCHA during login', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(400).send({ Error: 'Invalid CAPTCHA' });
  }

  if (!USER_REGEX.test(req.body.username)) {
    logger.warn('Invalid username format during login', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(400).json({ Error: 'Username should contain only alphabets and number.' });
  }

  if (!PWD_REGEX.test(req.body.password)) {
    logger.warn('Invalid password format during login', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(400).json({ Error: 'Password should contain alphabets, special characters, and numbers.' });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [req.body.username], (err, results) => {
    if (err) {
      logger.error('Database error during login', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.json({ Error: err });
    }
    if (results.length > 0) {
      bcrypt.compare(req.body.password.toString(), results[0].password, (err, response) => {
        if (err) {
          logger.warn('Invalid username or password during login', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
          return res.json({ Error: "Invalid username or password" });
        }
        if (response) {
          const username = results[0].username;
          const role = results[0].role;
          const token = jwt.sign({ username, role }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
          const refreshToken = jwt.sign({ username, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '25200s' });
          refreshTokens.push(refreshToken);
          res.cookie('access-token', token, { httpOnly: true, secure: true, sameSite:'none' });
          logger.info(`User ${username} logged in successfully`, { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
          return res.json({ Status: "Success", token, refreshToken });
        } else {
          logger.warn('Invalid username or password during login', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
          return res.json({ Error: "Invalid username or password" });
        }
      });
    } else {
      logger.warn('Login failed: invalid username or password', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.json({ Error: "Login failed. Invalid username or password" });
    }
  });
});


app.post('/token', csrfProtection, (req, res) => {
  const { token } = req.body;
  if (!token) {
    logger.warn('No token provided for refresh', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(token)) {
    logger.warn('Invalid refresh token', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.sendStatus(403);
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      logger.error('Error verifying refresh token', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    res.cookie('access-token', accessToken, { httpOnly: true, secure: true, sameSite:'none' });
    logger.info('Access token refreshed successfully', { username: user.username, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
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
    port: 465,
    secure:true,
    logger:true,
    secureConnection:false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls:{
      rejectUnauthorized:true
    }
  });

  // receiver user email update
  // attachment update
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString();
  const timeString = currentDate.toLocaleTimeString();
  const mailOptions = {
    from: process.env.EMAIL,
    to: 'cuong.dm214948@sis.hust.edu.vn',
    subject: 'Order Payment Confirmation',
    text: `Dear Customer,

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
    logger.info(`User ${username} has updated profile successfully.`);
    return res.json({ Status: 'Profile updated successfully' });
  });
});


app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
