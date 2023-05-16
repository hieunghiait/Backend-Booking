import { cls } from 'sequelize';
import db from '../models/index';
import CRUDService from '../services/CRUDService';
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log('------------------------')
        console.log(data)
        console.log("------------------------");
        return res.render('homePage.ejs', {
            //convert data  kieu JSON sang kieu string  
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }
}
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs')
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}
let postCRUD = async (req, res) => {
    let messenger = await CRUDService.createNewUser(req.body);
    console.log(messenger);
    return res.send('Tạo mới user thành công');
}
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();

    //in du lieu ra man hinh
    // console.log('----------------')
    // console.log(data)
    // console.log('----------------')
    return res.render("display-CRUD.ejs", {
        dataTable: data
    })
}
let getEditCRUD = async (req, res) => {
    //Lấy ID của người dùng
    let userId = req.query.id
    //Log user 
    console.log(userId)
    //Nếu user có 
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        //Check userData found 
        return res.render('editCRUD.ejs', {
            user: userData
        });
    } else {
        return res.send("User not found!");
    }
}
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render("display-CRUD.ejs", {
        dataTable: allUsers
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        try {
            await CRUDService.deleteUserById(id);
            return res.status(200).send('User deleted successfully')
        } catch (error) {
            console.log(error)
        }
        return res.send('Delete user sucessfully')
    } else {
        return res.status(400).send('User ID not found')
    }
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}