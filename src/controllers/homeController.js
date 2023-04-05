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
    return res.send('post crud from server');
}
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    //in du lieu ra man hinh
    console.log('----------------')
    console.log(data)
    console.log('----------------')
    return res.render("display-CRUD.ejs", {
        dataTable: data
    })
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
}