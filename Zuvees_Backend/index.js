require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./app/db/connectDB");

const routes = require("./app/routes/index");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

connectDB();

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
