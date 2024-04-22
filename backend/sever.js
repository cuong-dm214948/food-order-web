const cors = require('cors');
const  mysql = require('mysql');
const  bcrypt = require('bcrypt');
const  cookieParser = require('cookie-parser');

// const salt = 10; // It's common to use 'saltRounds' rather than a plain 'salt'

const express = require("express")

const app =express()
app.listen(8081)
app.use(express.json());

app.use(cors());
// {
//     origin: ['http://localhost:3000'], // Adjust if your frontend is on another port
//     method:["POST", "GET"],
//     credentials: true // to support cookies from frontend
// }));

// app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'signup'
});

app.post('/register', (req, res) => {
    const sql = "INSERT INTO login (name,username, password) VALUES (?,?,?)";
    //bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    //     if (err) {
    //         return res.json({ Error: "Error hashing password" });
    //     }
        const sentName = req.body.name
        const sentUsername =req.body.username
        const sentPassword =req.body.password
    const values = [sentName, sentUsername,  sentPassword]

        db.query(sql, values, (err, result) => {
            if (err) {
                res.json({error:err})
            }
            console.log('user add')
            //res.send({ message: "Success add user" });
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
        const sql = "SELECT * FROM login WHERE username = ? && password =?";
       db.query(sql, values , (err, results) => {
            if (err) {
                res.send({ error: "Error login" });
            }
            console.log(results);
            // if (results.length > 0){
            //     res.send(results)
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
            // else{
            //     res.send({error:"No email existed"})
            // }
       
//         });
    });
});

// app.listen(8081, () => {
//     console.log("Server running on http://localhost:8081")
// });
