const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path')
const Graph1 = require('./graph1')

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'epics'
})

connection.connect();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname + "/")))
app.get('/login1.html', (req,res) => {
    res.sendFile(__dirname + "/login1.html")
})
// console.log("ename,empno");

const myGraph1 = new Graph1(200)
app.get('/',(req,res) => {
    res.sendFile(__dirname+"/form.html")
})

app.post('/',(req,res) => {
    var r = req.body.room;
    var dt = req.body.date;
    var st = req.body.st;
    var et = req.body.et;
    console.log(st)
    console.log(typeof(st))
    // var b = toDate(st,”h:m”)
    // var bid = uuidv4();
    let k;
    const slots = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
    connection.query('SELECT COUNT(BookingID) AS id_count FROM bookings',(err,rows) => {
        k = rows[0].id_count;
        console.log(k + "inside")
    })
    connection.query('SELECT * from bookings where RName = ? and BookingDate = ? and (StartTime between ? and ? or EndTime between ? and ?)', [r, dt, st, et, st, et], (err,results,fields) => {
        if(err){
            console.log(err)
        }
        if(results.length == 0){
            res.send("Booked");
            connection.query('INSERT INTO bookings (RName , BookingDate, StartTime, EndTime) VALUES (?, ?, ?, ?)',[r, dt, st, et],)
        }
        else{
            connection.query('SELECT * from bookings where RName = ? and BookingDate = ?',[r,dt],(err,results,fields)=>{
                console.log(results)
                console.log(results[0])
                var n = results.length;
                
                console.log(k +"outside")
                // for(let i = 0 ; i < n ; i++){
                //     myGraph.addEdge(results[i].BookingID,k+1)
                // }
                // let a = myGraph.coloring()
                // const bid = results[0]
                // console.log(a)
                let obj = {
                    BookingID: k+1,
                    RName: r,
                    BookingDate: dt,
                    StartTime: st,
                    EndTime: et
                }
                console.log("asdfg")
                let a1 = myGraph1.coloring(n+1,results,obj)
                // res.send("Room already booked at that date and time")
                let s , e;
                s = a1[0];
                console.log("qwertyui")
                // console.log(s+ " sssssss")
                e = a1[a1.length-1]
                // for(let i = 0 ; i < a1.length ; i++){
                //     console.log(slots[a1[i]])
                // }
                // console.log(a1)
                // console.log(a1[s] + "  "+ a1[e])
                res.send("slots is available form " + slots[s] + " to " + slots[e+1])
            })
        }
        res.end()
    }) 
})

app.post('/login1.html' ,(req,res)=>{
    // console.log("ename,empno");
    var email = req.body.email;
    var password = req.body.password;
    let uid;
    console.log(email,password);
    console.log("wertyui")
    connection.query('select * from users where email = ? and passwords = ?',[email,password] ,(err,results,fields)=>{
        console.log(results + "...........")
        console.log(typeof(results) +"typeeeeee")
        console.log(results[0])
        console.log(results[0].Username)
        console.log(results[0].Email)
        // console.log(results[0].UserID)
        if(err){
            console.log(err);
        }
        if(results.length > 0){
            // console.log(results + "RESULTS")
            // console.log(typeof(results))
            // console.log(results[0].userID + "qqqqqqqqqqqqqq")
            uid = results[0].UserID;
            res.redirect('/description.html')
        }
        else{
            console.log("############")
            res.redirect("/")
        }
        res.end()
    })
})

app.post('/signup.html',(req,res)=>{
    var username = req.body.username;
    var contact = req.body.contact;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;
    // if(err){
    //     console.log(err);
    // }
    if(password == repassword){
        res.redirect("/login1.html")
        // res.send("You are Signed up!")
        connection.query('INSERT INTO users (username,email,contactNo,passwords) VALUES (?, ?, ?, ?)',[username,email,contact,password],(err,results,fields) => {
            if(err){
                console.log(err);
            }
        })

    }
    else{
        res.send("Password mismatch")
        // res.redirect('/')
    }
})

app.get('/description.html', (req, res) => {
    console.log(uid + "qwerty")
    res.sendFile(__dirname + "/description.html")
    
})

app.get('/signup.html', (req,res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.listen(3500, () => {
  console.log('Server is listening on port 3500');
});