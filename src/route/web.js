import express, { Router } from "express";
import homeController from "../controllers/homeController"
let router = express.Router();
let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    //rest api
    router.get("/hieunghia", (req, res) => {
        return res.send("My name is Hieu Nghia");
    });
    return app.use("/", router);
};

module.exports = initWebRoutes;
