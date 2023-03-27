import express from "express";
import bodyParser from "body-parser";
import viewEngie from "./config/viewEngine";
import initWebRoutes from "./route/web";
require("dotenv").config();
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

viewEngie(app);
initWebRoutes(app);
let port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
});
