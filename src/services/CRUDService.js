import bcrypt from 'bcryptjs';
import db from '../models/index';
import { request } from 'express';


const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (reslove, reject) => {
        try {
            //hash password
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            reslove("Create a new user successfully")
        } catch (e) {
            reject(e);
        }
    })
}
//hash password
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}
//Lấy hết tất cả User 
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            //Lấy hết dữ liệu
            let users = db.User.findAll();
            raw: true,
                //exit Promise
                resolve(users)
        } catch (e) {
            reject(e);
        }
    })
}
let getUserInfoById = (userId) => {
    return new Promise(async (reslove, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            })
            if (user) {
                reslove(user)
            } else {
                reslove({})
            }
        } catch (e) {
            reject(e);
        }
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                console.log('check user:', user);
                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                reject(new Error("User not found"));
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    }).catch((error) => {
        console.error(error);
        // Handle the error here
    });
}

let deleteUserById = (userId) => {
    return new Promise(async (reslove, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (!user) {
                return reslove('User not found')
            }
            await user.destroy();
            reslove('User deleted successfully');
        } catch (e) {
            reject(e);
        }
    })
}

//Export 
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}