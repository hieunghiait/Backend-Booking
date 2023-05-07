import { emit } from "nodemon";
import db from "../models/index";
import bcrypt, { encodeBase64, hash } from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
/**
 * Hàm dùng để mã hóa password
 * @param {*} password 
 * @returns trả về chuỗi password đã được mã hóa
 */
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
/**
 * Hàm xử lý đăng nhập
 * @param {*} email đăng nhập với tham số là email
 * @param {*} password đăng nhập với tham số là password
 * @returns trả về object JSON nếu lấy được đúng email và password trong database
 */
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Please try other email`;
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}
/**
 * Hàm dùng để kiểm tra email có tồn tại trong db
 * @param {*} userEmail 
 * @returns trả về true nếu email đã tồn tại trong db ngược lại trả về false
 */
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            });
            // Check nếu user rỗng
            if (user) {
                //Trả về true nếu email có trong db
                resolve(true);
            } else {
                //Trả về false nếu email có trong db
                resolve(false);
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    });
};
/**
 * Hàm có chức lấy thông tin người dùng
 * @param {*} userId 
 * @returns Return about all user in database if type = all else return record user with id specify 
 */
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        //ignore password
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }

                })
            }
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })
}
/**
 * Hàm có chức năng tạo mới 1 người dùng
 * @param {*} data 
 * @returns 
 */
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //validate email 
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in use, Please try another email',
                })
            } else {
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
                    positionId: data.positionId,
                    image: data.avatar
                });

                // const userObject = {
                //     email: user.email,
                // }
                // const token = jwt.sign(userObject, '123123');
                // resolve({
                //     errCode: 0,
                //     errMessage: 'OK',
                //     token: token
                // })
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}
/**
 * Hàm chức năng xóa người dùng với id cụ thể
 * @param {*} userId 
 * @returns 
 */
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let foundUser = await db.User.findOne({
                where: { id: userId }
            })
            if (!foundUser) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                errMessage: `The user is deleted`
            })
        } catch (e) {
            reject(e)
        }
    })
}
/**
 * Hàm xử lý cập nhật thông tin người dùng với id cụ thể
 * @param {object} data 
 * @returns 
 */
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isNaN(data.id) || !data.id || !data.firstName || !data.lastName || !data.address) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing require parameters',
                })
            } else {
                // Query the database to find the user with matching id
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    user.roleId = data.roleId;
                    user.positionId = data.positionId;
                    user.gender = data.gender;
                    user.phonenumber = data.phonenumber;
                    if (data.avatar) {
                        user.image = data.avatar;
                    }
                    await user.save();
                    resolve({
                        errCode: 0,
                        message: 'Update the user success'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        message: `User's not found !`
                    });
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
/**
 * Hàm xử lý lấy thông tin từ bảng allCode
 * @param {object} typeInput 
 * @returns trả về object chứa data trong bảng allCode hoặc trả về lỗi
 */
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
}