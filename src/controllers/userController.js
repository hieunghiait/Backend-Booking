const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const multer = require('multer');
const express = require('express');
const app = express();
import user from "../models/user";
import userService from "../services/userService";
import bcrypt, { encodeBase64, hash } from 'bcryptjs';
import db from "../models/index";

const validateEmail = (email) => {
    const regex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
    return regex.test(email);
};
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    try {
        if (!validateEmail(email)) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Invalid email'
            })
        }
        if (!(email && password)) {
            return res.status(500).json({
                errCode: -1,
                errMessage: 'Missing inputs parameter'
            })
        }
        let userData = await userService.handleUserLoginService(email, password);
        return res.status(200).json({
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : {}
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: -1,
            errMessage: 'Internal server error'
        })
    }
}
let handleRegister = async (req, res) => {
    try {
        let user = req.body.email;
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
        res({
            errCode: -1,
            errMessage: 'Internal server error'
        })
    }
}
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if (!id || id.trim() === '') {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required parameters of invalid id',
            users: [],
        })
    }
    try {
        let users = await userService.getAllUsers(id)
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            users,
        })
    } catch (error) {
        console.log('Show log error: ' + error)
        return res.status(500).json({
            error: 2,
            errMessage: 'Internal server error'
        })
    }

}
let handleCreateNewUser = async (req, res) => {
    try {
        // const image = req.file;
        // req.body.image = image.path;
        let info = await userService.createNewUser(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 2,
            errMessage: 'Internal server error'
        });
    }
}

let registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log('Show log data : ', req.body);
    let data = req.body;
    try {
        let user = await userService.registerUserService(data)
        return res.status(200).json(user)
    } catch (error) {
        console.log('Show log error: ', error)
        return res.status(500).json({
            errCode: 2,
            errMessage: 'Internal server error'
        })
    }
}
let handleEditUser = async (req, res) => {
    let data = req.body;
    console.log(data);
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    console.log('Show log', req.body.id);
    if (!req.body.id) {
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
    handleRegister, handleRegister,
    registerUser: registerUser,
}