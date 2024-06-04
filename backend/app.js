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
const session = require('express-session');
const passport = require('passport');
require('./auth');

const app = express();
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'GET'],
  credentials: true,
}));

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});


function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get('/auth/google',
  passport.authenticate("google", ["profile", "email"]
  ));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/auth/google/failure'
  })
);

app.get("/auth/google/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user.name,

		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

app.get('/auth/google/failure', (req, res) => {
  res.status(401).json(	{		
    error: true,
    message: "Fail Loged In"
  })
});

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const authMiddleware = (req, res, next) => {
  const token = req.cookies['access-token'];
  console.log(token)
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

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const USER_REGEX = /^[a-z0-9]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$&*()]).{8,24}$/;

app.post('/register', csrfProtection, async (req, res) => {
  const captchaValid = await validateCaptcha(req.body.captchaToken);
  if (!captchaValid) {
    logger.warn('Invalid CAPTCHA during registration', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(400).send({ Error: 'Invalid CAPTCHA' });
  }

  if (USER_REGEX.test(req.body.username)) {
    return res.status(400).json({ Error: 'Username should contain only alphabets and number.' });
  }

  if (PWD_REGEX.test(req.body.password)) {
    return res.status(400).json({ Error: 'only alphabets, special character, numbers.' });
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
        logger.info(`User ${username} has registered in successfully.`);
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

  if (USER_REGEX.test(req.body.username)) {
    return res.status(400).json({ Error: 'Username should contain only alphabets and number.' });
  }

  if (PWD_REGEX.test(req.body.password)) {
    return res.status(400).json({ Error: 'only alphabets, special character, numbers.' });
  }
  
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [req.body.username], (err, results) => {
    if (err) {
      logger.error('Error comparing username:', err);
      return res.json({ Error: err });
    }
    if (results.length > 0) {
      bcrypt.compare(req.body.password.toString(), results[0].password, (err, response) => {
        console.log(response)
        if (err) { 
          logger.error('Error comparing passwords:', err);
          return res.json({ Error: "Invalid1 username or password" });}
        if (response) {
          const username = results[0].username;
          const role = results[0].role;
          logger.info(`User ${username} has logged in successfully.`);
          const token = jwt.sign({ username, role }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
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
    res.cookie('access-token', accessToken, { httpOnly: true, secure: true, sameSite:'strict' });
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
  console.log(process.env.EMAIL, process.env.PASSWORD)
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
  console.log( req.body)
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.send("Logout successful");
});

// Combined logout endpoint
app.get("/logout", (req, res) => {
  // Check if the user is authenticated via Google authentication
  if (req.isAuthenticated() && req.user.provider === 'google') {
    // Clear the session cookie for Google authentication
    res.clearCookie('connect.sid', { path: '/' });
    return res.json({ Status: "Success" });
  } else {
    // Clear the token for regular authentication
    res.clearCookie('access-token');
    return res.json({ Status: "Success" });
  }
});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the destination directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // specify the filename
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});


app.post('/profile', csrfProtection, authMiddleware, upload.single('profileImage'), (req, res) => {
  const { fullName, mobileNo, email, address } = req.body;
  const username = req.username;
  const profileImage = req.file ? req.file.filename : null; // Get the uploaded file name

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
  console.log("sdhbuwef")

  const sql = profileImage 
    ? "UPDATE users SET fullName = ?, mobileNo = ?, email = ?, address = ?, profileImage = ? WHERE username = ?"
    : "UPDATE users SET fullName = ?, mobileNo = ?, email = ?, address = ? WHERE username = ?";
  const values = profileImage 
    ? [fullName, mobileNo, email, address, profileImage, username]
    : [fullName, mobileNo, email, address, username];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ Error: 'Internal server error' });
    }
    logger.info(`User ${username} has updated profile successfully.`);
    return res.json({ Status: 'Profile updated successfully' });
  });
});

app.get('/profile', csrfProtection, authMiddleware, (req, res) => {
  const username = req.username;

  const sql = "SELECT fullName, mobileNo, email, address, profileImage FROM users WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: 'Internal server error' });
    }
    if (result.length > 0) {
      const user = result[0];
      logger.info('Get user data successfully', { username: user.username, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.json({
        fullName: user.fullName,
        mobileNo: user.mobileNo,
        email: user.email,
        address: user.address,
        profileImageUrl: user.profileImage 
        
      });
    } else {
      return res.status(404).json({ Error: 'User not found' });
    }
  });
});


app.post('/change_password', csrfProtection, authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.username;

  if (!PWD_REGEX.test(newPassword)) {
    logger.warn('Invalid password format during password change', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    return res.status(400).json({ Error: 'Password should contain alphabets, special characters, and numbers.' });
  }

  const sqlSelect = "SELECT password FROM users WHERE username = ?";
  db.query(sqlSelect, [username], (err, results) => {
    if (err) {
      logger.error('Database error during password change', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.status(500).json({ Error: 'Internal server error' });
    }
    if (results.length > 0) {
      bcrypt.compare(currentPassword, results[0].password, (err, response) => {
        if (err || !response) {
          logger.warn('Invalid current password during password change', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
          return res.status(400).json({ Error: 'Invalid current password' });
        }
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            logger.error('Error generating salt during password change', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
            return res.status(500).json({ Error: 'Internal server error' });
          }
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) {
              logger.error('Error hashing new password during password change', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
              return res.status(500).json({ Error: 'Internal server error' });
            }
            const sqlUpdate = "UPDATE users SET password = ? WHERE username = ?";
            db.query(sqlUpdate, [hash, username], (err, result) => {
              if (err) {
                logger.error('Database error during password update', { error: err, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
                return res.status(500).json({ Error: 'Internal server error' });
              }
              logger.info('Password updated successfully', { username, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
              return res.json({ Status: 'Password updated successfully' });
            });
          });
        });
      });
    } else {
      logger.warn('User not found during password change', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.status(404).json({ Error: 'User not found' });
    }
  });
});




app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
