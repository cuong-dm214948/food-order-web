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

app.get('/', authMiddleware, (req, res) => {
  return res.json({ Status: "Success", username: req.username, userType: req.userType });
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
      const values = [req.body.username, hash, req.body.role];
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
  console.log()
  const captchaValid = await validateCaptcha(req.body.captchaToken);
  if (!captchaValid) {
    return res.status(400).send({ Error: 'Invalid CAPTCHA' });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [req.body.username], (err, results) => {
    if (err) {
      return res.json({ Error: err });
    }
    if (results.length > 0) {
      console.log(req.body.password.toString(), results[0].password)
      bcrypt.compare(req.body.password.toString(), results[0].password, (err, response) => {
        console.log(response)
        if (err) { 
        
          return res.json({ Error: "Invalid1 username or password" });}
        if (response) {
          const username = results[0].username;
          const role = results[0].role;
          const token =jwt.sign({ username, userType }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
          const refreshToken = jwt.sign({ username, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '25200s' });
          refreshTokens.push(refreshToken);
          res.cookie('access-token', token, { httpOnly: true, secure: true, sameSite:'none' });
          return res.json({ Status: "Success", token, refreshToken });
        } else {
          console.log("rres",response)
          return res.json({ Error: "Invalid2 username or password" });
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
    const accessToken = generateAccessToken(user.username, user.userType);
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
      user: "domanhcuong03072003@gmail.com",
      pass: "uqfb whfd evlq wlbz",
    },
    tls:{
      rejectUnauthorized:true
    }
  });

// attachments=[]

const currentDate = new Date();
const dateString = currentDate.toLocaleDateString();
const timeString = currentDate.toLocaleTimeString();
  const mailOptions = {
    from: 'domanhcuong03072003@gmail.com',
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

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
