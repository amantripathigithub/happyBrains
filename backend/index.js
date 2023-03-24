const express = require("express");
const ejs=require('ejs');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require('dotenv');
var app = express();
dotenv.config({ path: './config.env' });
require('./db/connection');
var TMClient = require('textmagic-rest-client');

//const register = require("./model/patient");
//app.use(require('./router/auth'));
//const User = require('./model/patient');
// for hotel schema
//const Hotel = require('./model/contributor');
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

TWILIO_ACCOUNT_SID = "AC767517aeca2be00365e5ccf94783c392"
TWILIO_AUTH_TOKEN = "e86b61cf367a3446ed9ef8c3db88f1e7"
TWILIO_SERVICE_SID = "VAd7f66546099e43f7d46310b5c2bdd997"

const client=require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN)


//   user.methods.generateAuthToken = async function(){
//     try{
//       const token = jwt.sign({_id:this._id.toString()},"mynameisdeepakduveshbackendwebdeveloper");
//       this.tokens = this.tokens.concat({token:token})
//       await this.save();
//       return token;
//     } catch(error){
//       res.send("the error part"+error);
//     }
// //   }
const Contributor = require('./model/contributor');
// for hotel schema
const Patient = require('./model/patient');

const Post = require('./model/post');

// for twilio
//app.use(jsonParser);
//const twilioRouter = require('./src/routes/twilio-sms');
//const { Client } = require("twilio/lib/twiml/VoiceResponse");
//app.use('/twilio-sms',twilioRouter);


// const userSchema = new mongoose.Schema({
//     users: Number,
// });

// const OTP = mongoose.model("OTP",userSchema);


// for otp
var randomN=123456;

app.get("/", (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/contributor"));
});


app.get("/logincon", (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/contributor-login"));
});

app.get("/signupcon", (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/contributor-signup"));
});
app.post("/verify",function(req,res){
    
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const name = req.body.name;
    const contact = req.body.phone;
    
    const user = new Contributor({ name: name, email: email, password: password, contact: contact ,category:"",rating:"0"});
    

  return   res.render("verify",{user:user});
})


app.post("/verifyotp",async function(req,res){
    const code=Number(req.body.otp);
    console.log(randomN);
    console.log(code);
    if(randomN===code){


        const email = req.body.email;
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        const name = req.body.name;
        const contact = req.body.phone;
        console.log(req.body);
       // const image = req.file.filename;
    
       
    
        
        Contributor.findOne({ email: email, password: password })
            .then(async (userExist) => {
                if (userExist)
                    return res.status(422).json({ error: "email exists already" });
    
                const user = new Contributor({ name: name, email: email, password: password, contact: contact ,category:"",rating:"0"});
    
                app.use(express.static("../frontend"));
                return res.render(path.join(__dirname, "../frontend", "/contributor-category"),{user:user});
    
               
    
            }).catch(err => { console.log(err); });




         
    }else{
        app.use(express.static("../frontend"));
       return res.render(path.join(__dirname, "../frontend", "/contributor-signup"));
    }
    
})

app.post("/signupcon", (req, res) => {
    //const contact=req.body.phone;
    randomN=Math.floor(Math.random() * 90000)+10000;
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const name = req.body.name;
    const contact = req.body.phone;
    
    if (!email || !password || !cpassword) {

        return res.json({ error: "fill properly!!" });

    }
    if (password != cpassword) {

        return res.json({ error: "password not match!!" });
    }


    
    con = String(contact);
    if (con.length != 10)
        return res.json({ error: "not a valid number" });

    Contributor.findOne({ email: email, password: password })
        .then(async (userExist) => {
            if (userExist)
                return res.status(422).json({ error: "email exists already" });



                client.messages.create({body:randomN, from:'+14754051584',to:"+91"+contact}).then(message=>console.log(message.sid)).catch((err)=>{console.log(err)});
                console.log("ha bhai");
                  
               



                const user = new Contributor({ name: name, email: email, password: password, contact: contact ,category:"",rating:"0"});
                app.use(express.static("../frontend"));
               return  res.render(path.join(__dirname, "../frontend", "/verify"),{user:user});

            // user.save().then(() => {
            //     res.status(201).json({ message: "registered !! " });
            // }).catch((err) => res.status(500).json({ error: "failed to register !! " }));


        }).catch(err => { console.log(err); });
    //console.log(req.body);
  
    // var c = new TMClient('username', 'C7XDKZOQZo6HvhJwtUw0MBcslfqwtp4');
    // c.Messages.send({text: 'test message', phones:'+917535895785'}, function(err, res){
    //     console.log('Messages.send()', err, res);
    // });





   
    //app.use(express.static("../frontend"));
    //res.render(path.join(__dirname, "../frontend", "/contributor-signup"));
});

app.get("/cat-contributor", (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/contributor-category"));
});

app.get("/user", (req, res) => {






    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/user"));
});


app.post("/feed",async function (req, res) {

    


const problem = req.body.blank;


///console.log(req.body);


const posts = await Post.find({ptype:problem});




    


    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/feed"),{posts:posts});
});



app.post("/solution", (req, res) => {



    const sol = req.body.blank;
    const problem2 = req.body.blank2;
    let arr = sol.split('@,');
    arr.pop();
    //console.log(arr);
    

        //console.log(req.body);
    
        app.use(express.static("../frontend"));
        res.render(path.join(__dirname, "../frontend", "/solution"),{sol:arr,problem:problem2});
    });
    
    

app.post("/contributor-home",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const name = req.body.name;
    const contact = req.body.phone;
    const cat=req.body.attlist;

    const user = new Contributor({ name: name, email: email, password: password, contact: contact ,category:cat,rating:"5"});

 user.save().then(() => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/contributor-home"),{user:user});
            }).catch((err) => res.status(500).json({ error: "failed to register !! " }));



    //console.log(req.body);
   
})

app.listen(3000, () => {
    console.log("Server listening on port " + 3000);
});
