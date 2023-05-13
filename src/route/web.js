import express, { Router } from "express";
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from '../controllers/doctorController'
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage)
    router.get("/about", homeController.getAboutPage)
    router.get("/crud", homeController.getCRUD)
    router.post("/post-crud", homeController.postCRUD)
    //Define route  CRUD
    router.get("/get-crud", homeController.displayGetCRUD)
    router.get("/edit-crud", homeController.getEditCRUD)
    router.post('/put-crud', homeController.putCRUD)
    //Define router delete user `
    router.get('/delete-crud', homeController.deleteCRUD)
    router.post('/api/login', userController.handleLogin)
    router.post('/api/register', userController.handleRegister)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/allcode', userController.getAllCode)
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getThongTinDoctorById)

    return app.use("/", router);
};

module.exports = initWebRoutes;
