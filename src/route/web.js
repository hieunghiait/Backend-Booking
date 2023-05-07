import express, { Router } from "express";
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from '../controllers/doctorController'
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    //Define route  CRUD
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    //Define router delete user `
    router.get('/delete-crud', homeController.deleteCRUD);
    //-----------------------------------------------
    /**
     * API Đăng nhập của người dùng
     **/
    router.post('/api/login', userController.handleLogin);
    /**
     * API lấy tất cả người dùng ID truyền ALL thì lấy hết còn truyền cụ thể id thì lấy duy nhất
     * 
     */
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    /**
     *  API tạo mới người dùng
     */
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    /**
     * API Chỉnh sửa thông tin người dùng với id người dùng được chỉ định
     */
    router.put('/api/edit-user', userController.handleEditUser);
    /**
     * API xóa người dùng với id được chỉ định
     */
    router.delete('/api/delete-user', userController.handleDeleteUser);
    /**
     *  API lấy tất cả  data trong bảng allcode
     */
    router.get('api/allcode', userController.getAllCode);
    /*------------------------------------------------- */
    /**
     * API lấy danh sách các Bác sĩ theo limit  
     */
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    /**
     *  API lấy thông tin của Bác sĩ
     */
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    /**
     *  API lưu thông tin thay đổi của Bác sĩ
     */
    router.get('/api/save-infor-doctors', doctorController.postInforDoctor)


    return app.use("/", router);
};

module.exports = initWebRoutes;
