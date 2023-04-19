import express, { Router } from "express";
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    //Define route 
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    //Define router delete user 
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    //Define router delete get-all-users
    router.get('/api/get-all-users', userController.handleGetAllUsers);

    router.get("/hieunghia", (req, res) => {
        return res.send("My name is Hieu Nghia");
    });

    return app.use("/", router);


};

module.exports = initWebRoutes;
