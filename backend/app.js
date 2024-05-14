const express = require("express")
const  mysql = require('mysql');
const dotenv = require('dotenv')
const cors = require('cors');
const jwt = require('jsonwebtoken')
const  bcrypt = require('bcrypt');
const  cookieParser = require('cookie-parser');


// Generates a token based on user information (e.g., username)
function generateAccessToken(username) {
    //"jwt-secret-key"
    // TOKEN_SECRET is used for data encryption and decryption
    const token = jwt.sign({ username },
    process.env.TOKEN_SECRET, { expiresIn: '7200s' });
    return token;
    }


dotenv.config({path: './.env'})
const app =express()
app.use(express.json())
app.use(cors({
    origin:['http://localhost:3000'],
    methods :['POST', 'GET'],
    credentials: true,

}))

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const authMiddleware = (req, res, next) => {
    const cookieHeader = req.headers.cookie;


    const cookiePairs = cookieHeader.split(';');
    console.log(cookieHeader)
    let token = null;
    for (const pair of cookiePairs) {
        const [key, value] = pair.trim().split('=');
        if (key === 'access-token') {
            token = value;
                break;
            }
        }
    if (!token) {
        return res.status(401).json({ Error: "No token provided" });
    } else {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ Error: "Invalid token" });
            } else {
                req.username = decoded;
                next();
                
            }
        });
    }
};

app.get('/', authMiddleware, (req, res) => {
    return res.json({ Status: "Success", username: req.username });
});


db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log(" mysql connect...")
    }

  });


  const saltRounds = 10; // Define the number of salt rounds

  app.post('/register', (req, res) => {
      const sql = "INSERT INTO users (username, password) VALUES (?,?)";
     
      bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
              return res.status(500).send("Internal server error");
          }
  
          bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
              if (err) {
                  return res.status(500).send("Internal server error");
              }
              
              const sentUsername = req.body.username;
              const values = [sentUsername, hash];
              
              db.query(sql, values, (err, result) => {
                  if (err) {
                      return res.status(500).send("Internal server error");
                  }
                  res.send({ Status: "Success" });
              });
          });
      });
  });
  

const refreshTokens = [];
app.post('/login', (req, res) => {
        const sentusername = req.body.username;
        const values = [sentusername];
        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, values , (err, results) => {
            if (err) {
                res.json({ Error: err });
            }
            
            if (results.length > 0){
                bcrypt.compare(req.body.password.toString(), results[0].password, (err, response) =>{
                    if (err) return res.json ({Error: "Invalid username or password"})
                    if (response){
                        const username =results[0].username
                        const token = generateAccessToken(username);
                        //console.log("access-token:", token)
                        const refreshToken =jwt.sign({username},process.env.REFRESH_TOKEN_SECRET);
                        refreshTokens.push(refreshToken)
                        res.cookie('access-token', token);
                        return res.json({Status:"Success", token, refreshToken})
                    }
                    else{
                        return res.json({Error:"Invalid username or password"})
                    }
                })
            }
            else{
                res.json({Error:"Login failed. Invalid username or password"})
            }

    });
});

app.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) {
    return res.sendStatus(401);
    }
    if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
    }
    jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
    return res.sendStatus(403);
    }
    const accessToken = jwt.sign({ username },
    process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m'});
    res.json({accessToken});
    });
});

app.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);
    res.send("Logout successful");
})

app.get('/logout', (req,res)=>{
    res.clearCookie('access-token')
    return res.json({Status:"Success"})
})
app.listen(5001, () => {
    console.log("Server running on http://localhost:5001")
});