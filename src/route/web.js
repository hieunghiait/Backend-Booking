import express, { Router } from "express";
import homeController from "../controllers/homeController"
let router = express.Router();
let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    //Định nghĩa route
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD)
    //rest api
    router.get("/hieunghia", (req, res) => {
        return res.send("My name is Hieu Nghia");
    });
    return app.use("/", router);
};

module.exports = initWebRoutes;
