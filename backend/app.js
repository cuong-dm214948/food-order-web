const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const fetch = require('node-fetch');
const winston = require('winston');
dotenv.config({ path: './.env' });
const session = require('express-session');
const passport = require('passport');
const multer = require('multer')
require('./auth');
const  userrouter = require ('./routes/user.js')
const adminrouter =require ('./routes/adminrouter.js')
const checkout = require('./routes/checkout.js')
const db = require ('./utils/db.js')

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

app.use('/auth', adminrouter )
app.use('/auth', userrouter )
app.use('/auth', checkout )

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
    console.log(req.user)
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user.displayName,

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

app.get('/login', authMiddleware, (req, res) => {
  return res.json({ Status: "Success", username: req.username, userType: req.userType });
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

  if (!v1 || !v2) {
    setErrMsg("Invalid Entry");
    setLoading(false);
    return;
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
        logger.info(`User ${req.body.username} has registered in successfully.`);
        res.send({ Status: "Success" });
      });
    });
  });
});

let refreshTokens = [];

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

app.post('/logout', csrfProtection, (req, res) => {
  console.log( req.body)
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.send("Logout successful");
});

app.get("/logout", (req, res) => {
  if (req.isAuthenticated() && req.user.provider === 'google') {
    res.clearCookie('connect.sid', { path: '/' });
    return res.json({ Status: "Success" });
  } else {
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

  const sql = profileImage 
  ? "INSERT INTO accountinfo (user_id, fullname, phone, email, address, profileImage) VALUES ((SELECT user_id FROM users WHERE username = ?), ?, ?, ?, ?, ?)"
  : "INSERT INTO accountinfo (user_id, fullname, phone, email, address) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?, ?, ?)";

  const values = profileImage 
    ? [username, fullName, mobileNo, email, address, profileImage]
    : [username, fullName, mobileNo, email, address];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ Error: 'Internal server error' });
    }
    logger.info(`User ${username} has updated profile successfully.`);
    return res.json({ Status: "Success" });
  });
});

app.get('/profile', csrfProtection, authMiddleware, (req, res) => {
  const username = req.username;
  const sql = "SELECT fullname, phone, email, address FROM accountinfo WHERE user_id = (SELECT id FROM users WHERE username = ?)";
  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: 'Internal server error' });
    }
    if (result.length > 0) {
      console.log(result)
      const user = result[result.length - 1];
      logger.info('Get user data successfully', { username: user.username, ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.json({
        fullName: user.fullname,
        mobileNo: user.phone,
        email: user.email,
        address: user.address,
        
      });
    } else {
      return res.status(404).json({ Error: 'User not found' });
    }
  });
});

app.get('/order', csrfProtection, authMiddleware, async (req, res) => {
  const username = req.username; // Assuming username is set by authMiddleware
  console.log(username)
  if (username ==="admin"){
    const sql = "SELECT * FROM orders";

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.json({ Status: false, Error: err });
    }
    return res.json({ orders: result });
  });
  }
  else{
  const sql = "SELECT * FROM orders WHERE userid = ?";

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.json({ Status: false, Error: err });
    }
    return res.json({ orders: result });
  });}
});


app.post('/change_password', csrfProtection, authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.username;

  const v2 = PWD_REGEX.test(newPassword);
  if (!v2) {
    logger.warn('Invalid password format during password change', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
    setLoading(false);
    return;
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
