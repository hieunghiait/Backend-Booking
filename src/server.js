import express from "express";
import bodyParser from "body-parser";
import viewEngie from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from 'cors';
const auth = require("./middleware/auth");
require('dotenv').config();
let app = express();
app.use(cors({ origin: true, credentials: true }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
viewEngie(app);
initWebRoutes(app);
connectDB();

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Backend Nodejs is running on the port: ' + port);
});

app.post("/welcome", auth, (req, res) => {
    res.send(200).send("Hello")
})