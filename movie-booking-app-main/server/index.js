var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var CircularJSON = require('circular-json');
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb+srv://Ayushbhagat:bhagat@ayush@cluster0.2or7yc7.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/signup",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;

    var data = {
    
        "email" : email,
        "password" : password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.send({"messege":"signup success"})

})

app.post("/login",async (req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    const user=db.collection('users').find({"email": email},{"password":password})
    if(user){
        console.log(user)
        return res.send({"user":CircularJSON.stringify(user),"messege":"login sucsess"})
    }
    else{
        return res.send({"messege":"usernot found"})
    }   
})


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3000);


console.log("Listening on PORT 3000");