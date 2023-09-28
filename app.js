// Import required modules
const express = require('express');
var passwordHash = require("password-hash");
const bodyParser = require("body-parser");
const cors = require("cors");
const colors = require("colors");
const path = require('path');
const axios = require('axios');
const ejs = require('ejs');
const port = 3000
const request = require("request")

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore} = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");
initializeApp({
    credential: cert(serviceAccount),
});
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
// Create an Express application
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}));

// Serve static files (CSS and client-side JS)
app.set("view engine", "ejs");

app.use(cors());
// Parses JSON data in incoming requests.
app.use(express.json());
// Logs HTTP requests in a developer-friendly format.
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,"/public")));

// Define a route to fetch holiday data from the Abstract API
app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/loginsubmit", (req, res) => {
   // passwordHash.verify(req.query.Password, hashedPassword)
    const Email = req.body.Email;
    const Password = req.body.Password;

    db.collection("holiday")
        .where("Email", "==", Email)
        .get()
        .then((docs) => {
            let verified = false;
            docs.forEach((doc) => {
            verified = passwordHash.verify(Password, doc.data().Password);
            });
            if(verified){
                res.render("home",{result: null});
            }
            else{
                res.send("loginFail");
            }
            
           // console.log(docs);
           // if (docs.size > 0) {
         //       res.render("home");
         //   }else {
         //       res.send("loginfail");
        //    }
        });
});

app.post("/signupsubmit", (req, res) => {
    db.collection("holiday")
    .where("Email", "==", req.body.Email)
    .get()
    .then((docs) => {
        if(docs.size > 0){
            res.send("Hey,This account already exists with Email.");
        } 
        else{
            const Username = req.body.Username;
            const Email = req.body.Email;
            const Password = req.body.Password;
            //Adding new data to collection
            db.collection("holiday")
            .add({
                Email: Email,
                Password: passwordHash.generate(Password),    
            })
            .then(()=>{
                res.render("login");
            });
        }
    });
});

app.post("/holiday",async(req,res) => {
    try{
        const {country,year,month,day} = req.body;
        const countryParam = country === "India" ? "IN" : country;
        const apikey = "fbea48850b7447c8b3ac4ecfe4fbf252";
        console.log(`https://holidays.abstractapi.com/v1/?api_key=${apikey}&country=${countryParam}&year=${year}&month=${month}&day=${day}`)
        const response = await fetch(`https://holidays.abstractapi.com/v1/?api_key=${apikey}&country=${countryParam}&year=${year}&month=${month}&day=${day}`);
        const data = await response.json();
        console.log(data);
        if (data.length == 0){
            res.render("noholiday");
        }
        else{
            
        res.render("holiday",{data});
        }
    }   
    catch(err){
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
