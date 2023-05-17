const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path')
const { spawn } = require('child_process');
const { stringify } = require('querystring');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'epics'
})

let rooms = [
    {
        no: 0,
        room: "SRK222"
    },
    {
        no: 1,
        room: "MMM021"
    },
    {
        no: 2,
        room: "AUDITORIUM"
    }
]
connection.connect();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname + "/")))
app.get('/login1.html', (req,res) => {
    res.sendFile(__dirname + "/login1.html")
})

class Graph {
    constructor(v) {
      this.v = v;
      this.adj = new Array(v);
      for (let i = 0; i < v; i++) {
        this.adj[i] = [];
      }
    }
      addEdge(v, w) {
      this.adj[v].push(w);
      this.adj[w].push(v);
      }
}
  
app.get('/',(req,res) => {
    res.sendFile(__dirname+"/form.html")
})

app.post('/', (req,res) => {
    var r = req.body.room;
    var dt = req.body.date;
    var st = req.body.st;
    var et = req.body.et;
    let k;
    var x;
    connection.query('SELECT COUNT(BookingID) AS id_count FROM bookings',(err,rows) => {
        k = rows[0].id_count;
        console.log(k + "inside")
    })

    connection.query('SELECT * from bookings where BookingDate = ? and (StartTime between ? and ? or EndTime between ? and ?)', [dt, st, et, st, et], (err,results,fields) => {
        if(err){
            console.log(err)
        }
        if(results.length == 0){
            res.send("Booked");
            connection.query('INSERT INTO bookings (RName , BookingDate, StartTime, EndTime) VALUES (?, ?, ?, ?)',[r, dt, st, et],)
        }
        else{
                let g = new Graph(20);
                var n = results.length;
                
                console.log(k +"outside")
                let obj = {
                    BookingID: k,
                    RName: r,
                    BookingDate: dt,
                    StartTime: st,
                    EndTime: et
                }

                for(let i = 0 ; i < n ; i++){
                    g.addEdge(k,results[i].BookingID-1);
                }
                
                console.log("$$$$$$")
                console.log(g);
                console.log("@@@@@@@@")
                let s = JSON.stringify(g.adj);
                console.log(s)
                let s1 = s.slice(1,s.length-1)
                
                const pythonProcess = spawn('python', ['main.py']);

                pythonProcess.stdin.write(s1);
                pythonProcess.stdin.end();

                pythonProcess.on('exit', (code) => {
                console.log(`Python process exited with code ${code}`);
                });

                pythonProcess.stdout.on('data', (data) => {
                x = data;
                console.log(`stdout: ${data}`);
                console.log("Type of data: ", typeof(data));
                console.log("x  " + x)
                });

                pythonProcess.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });

                pythonProcess.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                });

                let str1;
                setTimeout(myFunction, 1000);
                function myFunction() {
                    console.log("x Time out... " + x)
                    console.log(typeof(x));
                    str1 = x.toString()
                    str1 = str1.trim()
                    console.log("str1",str1);
                    console.log(typeof(str1))
                    let s2 = str1.charAt(str1.length-1)
                    console.log("s2 ",s2)
                    y = parseInt(s2)
                    console.log("y ",y)
                    for(let i = 0 ; i < 3 ; i++){
                        if(rooms[i].no == y){
                            r = rooms[i].room;
                        }
                    }
                    // connection.query('INSERT INTO bookings (RName , BookingDate, StartTime, EndTime) VALUES (?, ?, ?, ?)',[r, dt, st, et],)
                    res.send(`You are allocated with ${r} room`)
                }
            }
        })
        setTimeout(ending,3000)
            function ending(){ 
                res.end()
            }
        })

app.post('/description.html',(req,res)=>{
    let s1 = req.body.des;
    let x;
    mail = req.body.email;
    
    const pythonProcess = spawn('python', ['nlp.py']);
    pythonProcess.stdin.write(s1);
    pythonProcess.stdin.end();
    pythonProcess.on('exit', (code) => {
        console.log(`Python process exited with code ${code}`);
    });

    pythonProcess.stdout.on('data', (data) => {
        x = data;
        console.log(`stdout: ${data}`);
        // console.log("Type of data: ", typeof(data));
        console.log("x  " + x)
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    
    setTimeout(func,3000)
    function func(){
        // console.log(x,"   x");
        let inputStr = x.toString();
        console.log(inputStr)
        console.log(typeof(inputStr))
        const obj = {};

        const lines = inputStr.split('\n');

        for (const line of lines) {
            const [key, value] = line.split(': ');
            
            if (key === 'Time keywords') {
                obj.time = value.slice(2, -3).split(',');
            } else if (key === 'Date keywords') {
                obj.date = value.slice(1, -2).split(',');
            } else if (key === 'Number of people') {
                obj.numPeople = parseInt(value);
            } else if (key === 'Extra requirements') {
                obj.extraReq = value.slice(2, -3).split(',');
            } else if (key === 'Reason for event') {
                obj.reason = value.trim();
            }
        }
        console.log(obj);
        console.log(typeof(obj.numPeople))
        
        var st = obj.time;
        console.log(st, "_________________")
        var et = req.body.et;
        const input = st[0];
        const [hours] = input.match(/\d+/g); // extract the hours and minutes using a regular expression
        const militaryHours = (hours === '12') ? '19' : String(Number(hours) + 12); // convert hours to military time (24-hour format)
        const timeString = militaryHours + ':' + '00' + ':00'; // construct the time string
        console.log(timeString); 
        console.log(typeof(timeString))
        st = timeString;
        // if(st.charAt[])
        let r1 = []
        let r;
        let dt = req.body.date
        connection.query('SELECT * from rooms', (err,results,fields) => {
            r1 = JSON.parse(JSON.stringify(results))
            console.log(r1,"insidee///////")
            console.log(typeof(r1))
            let min = 1000
            r = r1[0].RoomName
            for(let i = 0 ; i < r1.length ; i++){
                console.log(r1[i].capacity ," ", min, " ", obj.numPeople)
                if(r1[i].capacity < min && obj.numPeople <= r1[i].capacity){
                    min = r1[i].capacity
                    r = r1[i].RoomName
                    console.log(r + "******* " + i)
                }
            }
            console.log(r)
            console.log(dt)
            console.log(st)
            // const timeString = '20:00:00';
            const hour = parseInt(timeString.split(':')[0]);

            console.log(hour);
            console.log(typeof(hour))
            let et = (hour+1)+":00"+":00"
            console.log(et)
            console.log(typeof(et))
            let k;
            var x;
            connection.query('SELECT COUNT(BookingID) AS id_count FROM bookings',(err,rows) => {
                k = rows[0].id_count;
                console.log(k + "inside")
            })

            connection.query('SELECT * from bookings where BookingDate = ? and (StartTime between ? and ? or EndTime between ? and ?)', [dt, st, et, st, et], (err,results,fields) => {
                if(err){
                    console.log(err)
                }
                if(results.length == 0){
                    // res.send("Booked");
                    res.render('view1.ejs', {title:'Allocted room',sampleData:r})
                    connection.query('INSERT INTO bookings (RName , BookingDate, StartTime, EndTime, UserID) VALUES (?, ?, ?, ?, ?)',[r, dt, st, et, 1],)
                }
                else{
                        let g = new Graph(20);
                        // console.log(results)
                        // console.log(results[0])
                        var n = results.length;
                        
                        console.log(k +"outside")
                        let obj = {
                            BookingID: k,
                            RName: r,
                            BookingDate: dt,
                            StartTime: st,
                            EndTime: et
                        }

                        for(let i = 0 ; i < n ; i++){
                            g.addEdge(k,results[i].BookingID);
                        }
                        console.log("$$$$$$")
                        console.log(g);
                        console.log("@@@@@@@@")
                        let s = JSON.stringify(g.adj);
                        console.log(s)
                        let s1 = s.slice(1,s.length-1)
                        // let s2 = s1.charAt(s1.length-1)
                        // let s1 = s.slice()
                        // let dict = new Array(10);

                        // let j = 1;
                        // for(let i = 0 ; i < 10 ; i++){
                        //     if(g.adj[i].length != 0){
                        //         s = s + (j) + " : [[" + g.adj[i] + "]], ";
                        //         dict[j] = i; 
                        //         j++
                        //         // console.log(s)
                        //     }
                        // }
                        // console.log(dict,"dicttttt")
                        // var str = s.slice(0,-2)
                        // console.log(str + "????????????")
                        
                        const pythonProcess = spawn('python', ['main.py']);

                        pythonProcess.stdin.write(s1);
                        pythonProcess.stdin.end();

                        pythonProcess.on('exit', (code) => {
                        console.log(`Python process exited with code ${code}`);
                        });

                        pythonProcess.stdout.on('data', (data) => {
                            x = data;
                            console.log(`stdout: ${data}`);
                            console.log("Type of data: ", typeof(data));
                            console.log("x  " + x)
                        });

                        pythonProcess.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                        });

                        pythonProcess.on('close', (code) => {
                            console.log(`child process exited with code ${code}`);
                        });
                        let str1;
                        setTimeout(myFunction, 1000);
                        function myFunction() {
                            console.log("x Time out... " + x)
                            console.log(typeof(x));
                            str1 = x.toString()
                            // str2 = str1.slice(str1.length-2, str1.length-1)
                            str1 = str1.trim()
                            console.log("str1",str1);
                            console.log(typeof(str1))
                            let s2 = str1.charAt(str1.length-1)
                            console.log("s2 ",s2)
                        //     console.log(str1)
                        //     console.log(str2)
                            // let obj2 = eval(`(${str2})`);
                        //       console.log(obj2)
                        //       console.log(typeof(obj2),"Tyuouiqwiwd")
                        //       console.log(obj2[0],"qwertyu")
                        //       const result = [];
                        //     console.log(obj2.length)
                        //     for(let i = 0 ; i < obj2.length ; i++){
                        //         let obj1= {
                        //             node: i+1,
                        //             color: obj2[i][2][0]
                        //         }
                        //         console.log(obj1)
                        //         result.push(obj1)
                        //     }
                        //         console.log(result);
                        //     let y = result[result.length-1].color;
                        //     let boo_id = dict[result[result.length-1].node]
                        //     let r;
                            y = parseInt(s2)
                            console.log("y ",y)
                            for(let i = 0 ; i < 3 ; i++){
                                if(rooms[i].no == y){
                                    r = rooms[i].room;
                                }
                            }
                            // connection.query('INSERT INTO bookings (RName , BookingDate, StartTime, EndTime, UserID) VALUES (?, ?, ?, ?, ?)',[r, dt, st, et, 1],)
                            // res.send(`You are allocated with ${r} room`)
                            // connection.query('SELECT * from Bookings', (err, results, fields) => {
                                // console.log(results)
                                // if(err){
                                //     console.log(err);
                                // }
                        
                                // else{
                                    console.log(r)
                                    console.log(typeof(r))
                                    console.log("Entered successfully>>>>>>>>>>>")
                                    res.render('view1.ejs', {title:'Allocted room',sampleData:r})
                                // }
                            // })
                        }
                    }
                })
                setTimeout(ending,3000)
                function ending(){ 
                    res.end()
                }

        })
        // console.log(r,"22222222222");
        // console.log(typeof(r))
    }
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

app.get('/description.html/bookings', (req,res) => {
    res.sendFile(path.join(__dirname,'form1.html'));
    // var query = ;
    
})

app.post('/description.html/bookings', (req,res) => {
    console.log("tables...............")
    let email = req.body.email
    connection.query('SELECT b.BookingID, b.RName, b.BookingDate, b.StartTime, b.EndTime from Bookings b join Users on b.UserID = Users.UserID where Users.Email = (?)', [email],(err, results, fields) => {
        console.log(results)
        if(err){
            console.log(err);
        }

        else{
            console.log("Entered successfully>>>>>>>>>>>")
            res.render('view.ejs', {title:'Bookings Table',sampleData:results})
        }
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
        
        // res.send("You are Signed up!")
        const emailRegex = /^[\w-\.]+@student\.nitandhra\.ac\.in$/;

// Replace "emailFromHTML" with the actual variable name or string value that contains the email address from the HTML file
        if (!emailRegex.test(email)) {
            console.log("Invalid email address");
            res.redirect("/signup.html")
        } else {
            connection.query('INSERT INTO users (username,email,contactNo,passwords) VALUES (?, ?, ?, ?)',[username,email,contact,password],(err,results,fields) => {
                if(err){
                        console.log(err);
                    }
                })
                res.redirect("/login1.html")
            }
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