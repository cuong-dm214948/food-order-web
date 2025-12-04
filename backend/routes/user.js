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


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'logs.log' }),
    ],
  });

const adminrouter = express.Router()


adminrouter.get("/product", csrfProtection, async(req,res)=>{
  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: err});
      return res.json({Status: "Success", products: result});
  });
});

adminrouter.post('/checkoutCash', csrfProtection, async (req, res) => {
  const { userId, cartItems, totalAmount } = req.body;
  const products = JSON.stringify(cartItems)
  const timestamp = new Date().toISOString();
  const method = "Cash"

  // Assuming 'orders' table has columns: id, cart_items, total_amount, timestamp
  const sql = "INSERT INTO orders (userid, products, method, total, timestamp) VALUES (?, ?, ?, ?, ?)";
  const values = [userId, products, method, totalAmount, timestamp];
  db.query(sql, values, (err, result)=> {
    if(err) return res.json({Status: false, Error: err});
    logger.info(`User ${req.body.username} has checked out in successfully.`, { timestamp: new Date().toISOString() });
    return res.json({Status: "Success"});
  });

});

module.exports = adminrouter;