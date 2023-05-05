import db from "../models/index";
import bcrypt, { hash } from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            // Check if the user email exists in the database
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //compare password 
                //find hashpassword of user 
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    // If the user exists, compare their stored password with the provided password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        // If the passwords match, create a success response object with the user data
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                    } else {
                        // If the passwords don't match, create an error response object indicating wrong password
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    // If the user doesn't exist, create an error response object indicating not found
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }
            } else {
                // If the email doesn't exist, create an error response object indicating not found
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Plz try other email`;
            }
            // Resolve the promise with the response object
            resolve(userData)
        } catch (e) {
            // If there was an error, reject the promise with the error message
            reject(e)
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Try to find a user in the database with the specified email
            let user = await db.User.findOne({
                where: { email: userEmail }
            });

            // Check if a user was found
            if (user) {
                // Resolve the promise with true if a user was found
                resolve(true);
            } else {
                // Otherwise, resolve the promise with false
                resolve(false);
            }
        } catch (e) {
            // If there was an error, reject the promise with the error message
            reject(e);
        }
    });
};
/**
 * 
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
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
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
    })
}
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
        } catch (exception) {
            reject(exception)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}