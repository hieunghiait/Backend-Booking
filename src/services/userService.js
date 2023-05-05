import db from "../models/index";
import bcrypt, { hash } from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
/*
This function takes in a plain-text password and returns a hashed password using bcrypt hashing algorithm.

Input: A string representing the user's plain-text password.

Output: A Promise that resolves with a string representing the hashed password, or rejects if there is any error while hashing the password.

Notes:
- This function uses bcrypt library and a predefined salt value to generate the hash.
- The cost factor for the hash generation is not specified here, so it defaults to 10 (recommended).
- The hashing algorithm adds randomness to the hash value for added security
- Once a password has been hashed, it cannot be retrieved in its original form.
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

/*
This function checks if a user with a given email exists in the database.

Input: 
- userEmail: A string representing the email address to search for in the database.

Output: 
- A Promise that resolves with a boolean value indicating whether a user was found with the specified email or not.
- The promise gets rejected if there is any error while querying the database.

Notes:
- This function uses Sequelize ORM to query the database. 
- It returns a Promise that handles asynchronous operations, so it can be used with async/await syntax or .then()/.catch() methods.
- The returned boolean value indicates whether the specified email is already registered with a user account in the database (true) or not (false).
*/

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
/*
This function creates a new user in the database with the provided data.

Input:
- data: An object containing user information including:
  * email: A string representing the email address of the user.
  * password: A string representing the plain-text password of the user. The function will hash this password before storing it in the database.
  * firstName: A string representing the first name of the user.
  * lastName: A string representing the last name of the user.
  * address: A string representing the address of the user.
  * phonenumber: A string representing the phone number of the user.
  * gender: A string representing the gender of the user. It should be either '1' (for male) or '0' (for female).
  * roleId: An integer representing the ID of the role assigned to the user.

Output:
- A Promise that resolves with an object containing error code and message.
  * If the email address is already registered with another user account, the Promise resolves with errCode = 1 and errMessage = 'Your email is already in use, Please try another email'.
  * If the user is successfully created, the Promise resolves with errCode = 0 and errMessage = 'OK'.

Notes:
- This function uses two helper functions - checkUserEmail() and hashUserPassword() - to validate the email address and hash the plain-text password, respectively.
- It returns a Promise that handles asynchronous operations, so it can be used with async/await syntax or .then()/.catch() methods.
- The output object provides helpful error messages that can be used to notify the user about any issues encountered during the registration process.
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
/**
 * This function deletes a user by its ID from the database.
 * @param {number} userId - The id of the user to delete.
 * @returns {Promise<object>} - A promise that resolves to an object with an error code and message indicating whether the user has been deleted or not.
 */
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
/*
This function updates a user's information in the database.

Input: A data object containing the following properties:
    - id: The ID of the user to be updated (required, must be a number)
    - firstName: The new first name of the user (required)
    - lastName: The new last name of the user (required)
    - address: The new address of the user (required)

Output: A Promise that resolves with an object containing either:
    - errCode: 0 (success) and message: 'Update the user success'
    - errCode: 1 (failure) and message: `User's not found!`
    - errCode: 2 (failure) and errMessage: 'Missing required parameters'

Notes: This function uses Sequelize ORM to interact with the database.
*/
// This function updates user data and returns a Promise
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