const express = require("express")
const  mysql = require('mysql');
const dotenv = require('dotenv')
const cors = require('cors');
const  bcrypt = require('bcrypt');
const  cookieParser = require('cookie-parser');

dotenv.config({path: './.env'})
const app =express()
app.use(express.json())
app.use(cors())
const salt = 10; 
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log(" mysql connect...")
    }

  });

  app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (username, password, name) VALUES (?,?,?)";
    // bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    //     if (err) {
    //         return res.json({ Error: "Error hashing password" });
    //     }});
    console.log(req)
        const sentName = req.body.name
        const sentUsername =req.body.username
        const sentPassword =req.body.password
    const values = [ sentUsername,  sentPassword, sentName]

        db.query(sql, values, (err, result) => {
            if (err) {
                res.send(err)
            }
            console.log('Success add user')
            res.send({ message: "Success added user" });
        });
    // });
});

app.post('/login', (req, res) => {
    const sentusername = req.body.username;
    const sentpassword = req.body.password;
// //     bcrypt.hash(password, saltRounds, (err, hash) => {
// //         if (err) {
// //             return res.status(500).json({ error: "Error hashing password" });
// //         }
        const values = [sentusername, sentpassword];
        const sql = "SELECT * FROM users WHERE username = ? && password =?";
       db.query(sql, values , (err, results) => {
            if (err) {
                res.send({ error: err });
            }
           
            if (results.length > 0){
                res.send(results)}
//                 bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) =>{
//                     if (err) return res.json ({Error: "Password compare error"})
//                     if (response){
//                         // const name =data[0].username
//                         // const token =jwt.sign({username},"jwt-secret_key",{expiresIn:'1d'});
//                         // res.cookie('token',token);
//                         return res.json({Status:"Success"})
//                     }
//                     else{
//                         return res.json({Error:"Password not matched"})
//                     }
//                 })
            else{
                res.send({message:"Login failed. Invalid username or password"})
            }

    });
});

app.listen(5001, () => {
    console.log("Server running on http://localhost:5001")
});