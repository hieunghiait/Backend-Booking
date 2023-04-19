import db from "../models/index";
import bcrypt, { hash } from 'bcryptjs';

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

// Define a function that takes a user email as input and returns a promise
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
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
}