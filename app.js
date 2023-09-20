// Import required modules
const express = require('express');
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


// Serve static files (CSS and client-side JS)
app.set("view engine", "ejs");

app.use(cors());
// Parses JSON data in incoming requests.
app.use(express.json());
// Logs HTTP requests in a developer-friendly format.
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,"/public")));

// Define a route to fetch holiday data from the Abstract API
app.get("/login", (req,res) => {
    res.render("login");
});
app.get('/loginsubmit', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    db.collection("usersDemo")

    .where("Email", "==", email)
    .where("Password", "==", password)
    .get()
    .then((docs) =>{
        if (docs.size > 0){
            res.render("home")
        }
        else{
            res.render("home")
        }
    });
});
app.get("/signupsubmit", (req,res) => {
    const name = req.query.name;
    const email = req.query.email;
    const password = req.query.password;
    db.collection("usersDemo")
    .add({
        name:name,
        email: email,
        password: password,
    })
    .then(() => {
        res.render("login");
    })
})
/*app.get('/', async (req, res) => {
  try {
    const { year, country, month, day } = req.params;

    // Make a request to the Abstract API
    const response = await axios.get(`https://holidays.abstractapi.com/v1/?api_key=fbea48850b7447c8b3ac4ecfe4fbf252&year=${year}&country=${country}&month=${month}&day=${day}`);

    // Send the response from the API to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching holiday data.' });
  }
});*/
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
app.get("/",(req,res)=>{
    res.render("home");
})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
