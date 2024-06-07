const express = require("express");
const db = require('../utils/db.js');
const dotenv = require('dotenv');
const winston = require('winston');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const csurf = require('csurf');
dotenv.config({ path: './.env' });

const csrfProtection = csurf({ cookie: true });

const USER_REGEX = /^[a-z0-9]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$&*()]).{8,24}$/;

const refreshTokens = [];

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

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'logs.log' }),
    ],
  });

const adminrouter = express.Router()

adminrouter.post('/login', csrfProtection, async(req,res)=>{
    const captchaValid = await validateCaptcha(req.body.captchaToken);
    if (!captchaValid) {
      logger.warn('Invalid CAPTCHA during login', { ip: req.ip, userAgent: req.get('User-Agent'), url: req.originalUrl, timestamp: new Date().toISOString() });
      return res.status(400).send({ Error: 'Invalid CAPTCHA' });
    }
  
    const v1 = USER_REGEX.test(req.body.username);
    const v2 = PWD_REGEX.test(req.body.password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      setLoading(false);
      return;
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [req.body.username], (err, results) => {
      if (err) {
        logger.error('Error comparing username:', err);
        return res.json({ Error: err });
      }
      if (results.length > 0) {
        console.log(results)
        bcrypt.compare(req.body.password.toString(), results[0].password, (err, response) => {
          console.log(response)
          if (err) { 
            logger.error('Error comparing passwords:', err);
            return res.json({ Error: "Invalid1 username or password" });}
          if (response) {
            
            const username = results[0].username;
            const role = results[0].role;
            if (role == "admin"){
              logger.info(`User ${username} has logged in successfully as admin.`);
              const token = jwt.sign({ username, role }, process.env.TOKEN_SECRET, { expiresIn: '7200s' });
              const refreshToken = jwt.sign({ username, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '630000s' });
              refreshTokens.push(refreshToken);
              res.cookie('access-token', token, { httpOnly: true, secure: true, });
              
              return res.json({ Status: "Success", Role:{role}, token, refreshToken });}

            else{
              logger.info(`User ${username} has logged in successfully.`);
              const token = jwt.sign({ username, role }, process.env.TOKEN_SECRET, { expiresIn: '7200s' });
              const refreshToken = jwt.sign({ username, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '630000s' });
              refreshTokens.push(refreshToken);
              res.cookie('access-token', token, { httpOnly: true, secure: true, });
              
              return res.json({ Status: "Success", Role:{role}, token, refreshToken });}

            
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
})

module.exports = adminrouter;