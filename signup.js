const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'epics'
});

connection.connect();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname + "/")))
app.get('/signup.html',(req,res) => {
    res.sendFile(__dirname +"/signup.html")
    // res.send("hii")
})

app.post('/signup.html',(req,res)=>{
    var username = req.body.username;
    var contact = req.body.contact;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var userid = 10000;
    // if(err){
    //     console.log(err);
    // }
    if(password == repassword){
        res.send("You are Signed up!")
        connection.query('INSERT INTO users (userid,username,email,contactNo,password) VALUES (?, ?, ?, ?, ?)',[userid,username,email,contact,password],)
    }
    else{
        res.send("Password mismatch")
        // res.redirect('/')
    }
})

app.get('/login1.html', (req,res) => {
    res.sendFile(__dirname + "/login1.html")
})

app.listen(3500, () =>{
    console.log("3500")
});