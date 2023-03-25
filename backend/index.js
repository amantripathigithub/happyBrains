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
    return res.render(path.join(__dirname, "../frontend", "/contributor-login"));
});

app.post("/contributorsignin",async function(req,res){
    
    const email = req.body.email;
    //console.log(email);
    const password = req.body.password;
    
    try {
        // check if the user exists
       
        const cont = await Contributor.findOne({ email:email });
       
        if (cont) {
            //check if password matches
            
            const result = req.body.password === cont.password;
            // for token    ---->>>>
           // const token = await user.generateAuthToken();
            //console.log("the token part" + token);
            // res.cookie("jwt", token, {
            //     expires: new Date(Date.now() + 10000000),
            //     httpOnly: true
            //     //secure:true
            // });

            // yaha tak ---->>>>>>

            if (result) {

                category=cont.category;
               
                if(category[category.length-1]===','){
                    category=category.substring(0,category.length-1);
                }
                category=category.split(",");
                
              var  postss=[];

                for(var i=0;i<category.length;i++){
                   var posts = await Post.find({ptype:category[i]});
                   if(posts.length)
                    postss.push(posts);
                    console.log(posts);
                }

                var posts=[];
                for(var i=0;i<postss.length;i++){
                    for(var j=0;j<postss[i].length;j++){
                        posts.push(postss[i][j]);
                    }
                }
                
                    app.use(express.static("../frontend"));
                  return  res.render(path.join(__dirname, "../frontend", "/contributor-home"),{posts:posts,cont:cont});
            } else {
                // if password not match
                return res.json({ error: "invalid details !!" });
            }
        } else {




            // if user email is not exist 
           return res.render(path.join(__dirname, "../frontend", "/contributor-signup"));

        }
    } catch (error) {
       return res.status(400).json({ error });
    }

    //end


})




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


app.get("/user-login", (req, res) => {






    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/user-login"));
});


app.get("/user-signup", (req, res) => {






    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/user-signup"));
});



app.post("/solve", async (req, res) => {



var problem=req.body.blank2;
var email=req.body.blank3;

// neeeeeeeeeded



// if(problem[problem.length-1]===",")
// problem=problem.substring(0,problem.length-1);

// var post = await Post.findOne({ problem:problem });
// var arr=post.solutions;
// arr.push()

// const updateDoc = {
//     $set: {
//       solved: `1`
//     },
//   };
//   var posts;
//   var patient;
//   const result = await Post.updateOne({problem:problem}, updateDoc).then(async (message)=>
//  {
//  // posts = await Post.find({email:email}).then(async (message2)=>{
//       // patient = await Patient.find({email:email}).then((message3)=>{
//       //     //for(var i=1;i<100000000;i++);
          
         
//       // });
  
//  } );

// neeeeeeeeeded

    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/solve"),{problem:problem,email:email});
});





app.post("/loginuser",async function (req, res) {

    //start
    try {
        // check if the user exists
       
        const patient = await Patient.findOne({ email: req.body.email });
       
        if (patient) {
            //check if password matches
            
            const result = req.body.password === patient.password;
            // for token    ---->>>>
           // const token = await user.generateAuthToken();
            //console.log("the token part" + token);
            // res.cookie("jwt", token, {
            //     expires: new Date(Date.now() + 10000000),
            //     httpOnly: true
            //     //secure:true
            // });

            // yaha tak ---->>>>>>

            if (result) {
                //changes are here
                const posts = await Post.find({email:patient.email});
                    app.use(express.static("../frontend"));
                  return  res.render(path.join(__dirname, "../frontend", "/user-dashboard"),{patient:patient,posts:posts});
            } else {
                // if password not match
                return res.json({ error: "invalid details !!" });
            }
        } else {



            // if user email is not exist 
           return res.render(path.join(__dirname, "../frontend", "/user-signup"));

        }
    } catch (error) {
       return res.status(400).json({ error });
    }

    //end


   
    });
    



    app.post("/signupuser",async function (req, res) {

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
    
        Patient.findOne({ email: email, password: password })
            .then(async (userExist) => {
                if (userExist)
                    return res.status(422).json({ error: "email exists already" });
    
                const patient = new Patient({ name: name, email: email, password: password, contact: contact });
    
    
                patient.save().then(async () => {
                    const posts = await Post.find({email:patient.email});
                    app.use(express.static("../frontend"));
                    res.render(path.join(__dirname, "../frontend", "/user-dashboard"),{patient:patient,posts:posts});
                }).catch((err) => res.status(500).json({ error: "failed to register !! " }));
    
    
            }).catch(err => { console.log(err); });
    
        //console.log(req.body);
        //res.json({message:req.body});

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
    var problem2 = req.body.blank2;
   var email = req.body.blank3;
   var name = req.body.blank4;
   var patient= req.body.blank5;
   if(problem2[problem2.length-1]===',')
   problem2=problem2.substring(0,problem2.length-1);
   if(email[email.length-1]===',')
   email=email.substring(0,email.length-1);
   if(name[name.length-1]===',')
   name=name.substring(0,name.length-1);

var solved=req.body.blank6;


    let arr = sol.split('@,');
    arr.pop();
    //console.log(arr);
    

        //console.log(req.body);
    
        app.use(express.static("../frontend"));
        res.render(path.join(__dirname, "../frontend", "/solution"),{sol:arr,problem:problem2,email:email,name:name,patient:patient,solved:solved});
    });
    
    


    app.post("/solutionfeed", (req, res) => {



        const sol = req.body.blank;
        var problem2 = req.body.blank2;
      
       if(problem2[problem2.length-1]===',')
       problem2=problem2.substring(0,problem2.length-1);
      
    
    
    
        let arr = sol.split('@,');
        arr.pop();
        //console.log(arr);
        
    
            //console.log(req.body);
        
            app.use(express.static("../frontend"));
            res.render(path.join(__dirname, "../frontend", "/solutionfeed"),{sol:arr,problem:problem2});
        });
        
        
    

    app.post("/solved",async function (req, res) {

        var problem=req.body.blank2;
        var email=req.body.blank3;
        var name = req.body.blank4;
        var patient=req.body.blank5;
        if(problem[problem.length-1]===',')
   problem=problem.substring(0,problem.length-1);
   if(email[email.length-1]===',')
   email=email.substring(0,email.length-1);
   if(name[name.length-1]===',')
   name=name.substring(0,name.length-1);
       // problem=problem.substring(0,problem.length-1);
       // email=email.substring(0,email.length-1);
        console.log(email+name+problem);

      
           
            // this option instructs the method to create a document if no documents match the filter
            
            // create a document that sets the plot of the movie
            const updateDoc = {
              $set: {
                solved: `1`
              },
            };
            var posts;
            var patient;
            const result = await Post.updateOne({problem:problem}, updateDoc).then(async (message)=>
           {
           // posts = await Post.find({email:email}).then(async (message2)=>{
                // patient = await Patient.find({email:email}).then((message3)=>{
                //     //for(var i=1;i<100000000;i++);
                    
                   
                // });
            
           } );
            //clearTimeout(30000);
        
           //// clearTimeout(30000);
         
           //clearTimeout(300000);
            //console.log(patient);
             app.use(express.static("../frontend"));
            return  res.render(path.join(__dirname, "../frontend", "/user"));
           
        });
      



app.post("/createpost", (req, res) => {


const ptype=req.body.problemcategory;
const problem=req.body.problem;
           
            
                app.use(express.static("../frontend"));
                res.render(path.join(__dirname, "../frontend", "/verifylogin"),{ptype:ptype,problem:problem});
});
    


app.post("/postsolution", async (req, res) => {

    
    var problem=req.body.blank2;
    var solution=req.body.solution;
    solution=solution+"@";

    // neeeeeeeeeded
    
    
    
    if(problem[problem.length-1]===",")
    problem=problem.substring(0,problem.length-1);
    console.log(problem);
    var post = await Post.findOne({ problem:problem });
    var arr=post.solutions;
    arr.push(solution);
    
    const updateDoc = {
        $set: {
          solutions:arr
        },
      };
      var posts;
      var patient;
      const result = await Post.updateOne({problem:problem}, updateDoc).then(async (message)=>
     {
     // posts = await Post.find({email:email}).then(async (message2)=>{
          // patient = await Patient.find({email:email}).then((message3)=>{
          //     //for(var i=1;i<100000000;i++);
              
             
          // });
      
     } );
const email=req.body.blank3;
     const cont = await Contributor.findOne({ email:email });


     category=cont.category;
               
     if(category[category.length-1]===','){
         category=category.substring(0,category.length-1);
     }
     category=category.split(",");
     
   var  postss=[];

     for(var i=0;i<category.length;i++){
        var posts = await Post.find({ptype:category[i]});
        if(posts.length)
         postss.push(posts);
         //console.log(posts);
     }

     var posts=[];
     for(var i=0;i<postss.length;i++){
         for(var j=0;j<postss[i].length;j++){
             posts.push(postss[i][j]);
         }
     }
     
         app.use(express.static("../frontend"));
       return  res.render(path.join(__dirname, "../frontend", "/contributor-home"),{posts:posts,cont:cont});
    });
        
    
app.post("/verifylogin", async (req, res) => {


                const ptype=req.body.blank2;
                const problem=req.body.blank3;
                const email=req.body.email;
                



                 //start
    try {
        // check if the user exists
       
        const patient = await Patient.findOne({ email: req.body.email });
       
        if (patient) {
            //check if password matches
            
            const result = req.body.password === patient.password;
            // for token    ---->>>>
           // const token = await user.generateAuthToken();
            //console.log("the token part" + token);
            // res.cookie("jwt", token, {
            //     expires: new Date(Date.now() + 10000000),
            //     httpOnly: true
            //     //secure:true
            // });

            // yaha tak ---->>>>>>

            if (result) {
var solutionss=[]
                const post=new Post({email:email,ptype:ptype,name:patient.name,problem:problem,solved:"0",solutions:[]});

                post.save().then(async () => {
                    const posts = await Post.find({email:patient.email});
                    app.use(express.static("../frontend"));
                    res.render(path.join(__dirname, "../frontend", "/user-dashboard"),{patient:patient,posts:posts});
                }).catch((err) => res.status(500).json({ error: "failed to register !! " }));
    
    



                //changes are here
            
            } else {
                // if password not match
                return res.json({ error: "invalid details !!" });
            }
        } else {



            // if user email is not exist 
           return res.render(path.join(__dirname, "../frontend", "/user-signup"));

        }
    } catch (error) {
       return res.status(400).json({ error });
    }

    //end
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
