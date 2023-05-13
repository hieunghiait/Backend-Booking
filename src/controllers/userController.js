const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
import user from "../models/user";
import userService from "../services/userService";
import bcrypt, { encodeBase64, hash } from 'bcryptjs';
import db from "../models/index";
/**
 * Hàm dùng để xử lý đăng nhập gồm email và mật khẩu
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //compare password 
    //return userInfor
    //Access_Token: JWT 
    if (!(email && password)) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    console.log(userData)
    // if (userData.errCode === 0)
    // {
    //     const token = jwt.sign()
    // }
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleRegister = async (req, res) => {
    try {
        let email = req.body.id;
        let password = req.body.password;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let address = req.body.address;
        if (!(email && password && firstName && lastName && address)) {
            res.status(400).send("All input is required");
        }
        const oldUser = await db.User.findOne({
            email: email
        })
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
    } catch (error) {
        console.log(error)
    }
}
/**
 * Hàm dùng để xử lý lấy thông tin người dùng (id hoặc tất cả)
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id || id.trim() === '') {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required parameters of invalid id',
            users: [],
        })
    }
    let users = await userService.getAllUsers(id);
    console.log(users)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users,
    })
}
/**
 * Xử lý tạo mới một user.
 * @param {Object} req
 * @param {Object} res 
 */
let handleCreateNewUser = async (req, res) => {
    try {
        let message = await userService.createNewUser(req.body);
        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating a new user.' });
    }
}
/**
 * Xử lý cập nhật thông tin người dùng.
 * @param {Object} req
 * @param {Object} res
 */
let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}
/**
 * Hàm dùng để xử lý xóa người dùng với id được chỉ định
 * @param {object} req 
 * @param {object} res
 * @returns {object}
 */
let handleDeleteUser = async (req, res) => {
    if (!(req.body.id)) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        });
    }
    try {
        let message = await userService.deleteUser(req.body.id);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 2,
            errMessage: 'Internal server error'
        })
    }
}
/**
 * Hàm xử lý lấy dữ liệu từ bảng allcode
 * @param {*} req 
 * @param {*} res 
 * @returns trả về object chứa các field của bảng allcode
 */
let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get all code error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleRegister, handleRegister
}