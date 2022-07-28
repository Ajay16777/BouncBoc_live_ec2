const express = require("express");
const mongooes = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const ip = require("ip");

dotenv.config();

const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Connect to MongoDB
mongooes
  .connect("mongodb://localhost/BounceBox", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  });


  //test connection
  app.get("/", (req, res) => {
    //all routes info here

   let routes = [
    {
      method: "GET",
      path: "/",
      description: "Homepage",
      response: "Hello World",
    },
    {
      method: "GET",
      path: "/api/v1/projects",
      description: "Get all projects",
      response: "Array of projects",
    },
    {
      method: "GET",
      path: "/api/v1/projects/:id",
      description: "Get project by id",
      response: "Project",
    },
    {
      method: "POST",
      path: "/api/v1/projects",
      description: "Create a new project",
      response: "Project",
    },
  ];

  res.send(routes);


    
  }
  );


app.use("/api/users", require("./routes/User"));
app.use("/api/projects", require("./routes/Project"));
app.use("/api/versions", require("./routes/Version"));


