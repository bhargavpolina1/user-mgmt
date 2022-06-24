const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors(corsOptions));

var corsOptions = {
    origin: "http://localhost:3000"
  };
  // parse requests of content-type - application/json
  app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync().then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });



app.get("/",(req,res) => {
    res.json({message:"Hello Rockstar"})
});


require("./app/routes/routes.js")(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});

