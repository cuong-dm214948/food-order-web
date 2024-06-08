const express = require("express");
const logout = express.Router()

logout.get('/logout', (req, res) => {
    res.clearCookie('access-token');
    return res.json({ Status: "Success" });
  });



  module.exports = logout;