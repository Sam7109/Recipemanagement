const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const PORT = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const sequelize = require("./utils/seq");

const path = require("path");
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded payloads

const UserRoutes = require('./routes/userdetails')
const generatepresign = require('./routes/presigned.js')
const s3 = require('./awsConfigs/aws.js');
app.use(express.static(path.join(__dirname, "views")));

app.use('/users',UserRoutes)
app.use('/api',generatepresign)


app.get("/validate", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "loginsignup.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
  });

  app.get("/myProfile", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "myProfile.html"));
  });

  app.get("/adminpanel", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "adminpanel.html"));
  });



  
  // Example: Safely checking S3 service status without exposing details
s3.listBuckets((err, data) => {
    if (err) {
        console.log('Something went wrong'); // Generic error message
    } else {
        console.log('S3 Access Test: Success'); // Confirmation of success without details
    }
});

sequelize
  .sync() //{alter:true} force: true will drop existing tables { alter:true} will match with model definitions

  .then(() => {
    console.log("Database synchronized");
    // Start the server

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });



