require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const dbConfig = require("./config/db.config");

const app = express();
const Role = db.role;

app.use(cors());
app.use(express.json());
dbConnection();

require("./routes/auth.routes.js")(app);
require("./routes/user.routes.js")(app);
require("./routes/admin.routes.js")(app);

app.listen(process.env.PORT);

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

function dbConnection() {
  db.mongoose
    .connect(
      `mongodb+srv://${dbConfig.HOST}/${dbConfig.DB}?retryWrites=true&w=majority`,
      {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Successfully connect to MongoDB.");
      initial();
    })
    .catch((err) => {
      console.error("Connection error", err);
      process.exit();
    });
}
