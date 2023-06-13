import { emit } from "nodemon";
import db from "../models/index";
import bcrypt, { encodeBase64, hash } from "bcryptjs";
import user from "../models/user";
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);
require('dotenv').config()

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
      })
      if (user) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}
let handleUserLoginService = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          where: { email: email },
          attributes:
            [
              "email",
              "password",
              "firstName",
              "lastName",
              "roleId",
            ],
          raw: true,
        })
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Login sucessfully";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your's Email isn't exist in your system. Please try other email`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

const validateEmail = (email) => {
  const regex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
  return regex.test(email);
};
const validatePhoneNumber = (phonenumber) => {
  const regex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
  return regex.test(phonenumber);
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password || !data.firstName || !data.lastName || !data.address) {
        resolve({
          errCode: 1,
          errMessage: "Missing required fields"
        });
      }
      const isValidEmail = validateEmail(data.email);
      if (!isValidEmail) {
        resolve({
          errCode: 1,
          errMessage: 'Invalid email address',
        });
      }
      const emailExists = await checkUserEmail(data.email);
      if (emailExists) {
        return resolve({
          errCode: 1,
          errMessage: "Your email already exists in the database, Please try another email",
        });
      } else {
        const hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleId: 'R2',
          positionId: data.positionId,
          image: data.avatar,
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Create user successfully",
      });
    } catch (error) {
      console.log(error)
      reject(error)
    }
  });
}

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundUser = await db.User.findOne({
        where: { id: userId },
      });
      if (!foundUser) {
        resolve({
          errCode: 2,
          errMessage: `The user doesn't exist`,
        });
      } else {
        await db.User.destroy({
          where: { id: userId },
        });
        resolve({
          errCode: 0,
          errMessage: `The user is deleted`,
        });
      }
    } catch (e) {
      console.log('Show log error deleteUserService: ', e);
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email || !data.firstName || !data.lastName || !data.address
      ) {
        resolve({
          errCode: 2,
          errMessage: "Missing require parameters",
        });
      }
      let user = await db.User.findOne({
        where: { email: data.email },
        raw: false,
      });
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
          message: "User updated successfully",
        });
      } else {
        resolve({
          errCode: 1,
          message: `No user found with email ${data.email}`,
        });
      }
    } catch (error) {
      console.log('Show log error', error);
      reject(error);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        reject({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      console.log("Show log error: " + e.message)
      reject(e);
    }
  });
};
let registerUserService = (data) => {
  return new Promise(async (resolve, reject) => {
    if (!data) {
      reject({
        errCode: 1,
        errMessage: "Missing required fields"
      });
    }
    /*if (!data.email || !data.password || !data.firstName || !data.lastName || !data.address) {
      reject({
        errCode: 1,
        errMessage: "Missing required fields"
      });
    }*/
    try {
      const isValidEmail = validateEmail(data)
      if (!isValidEmail) {
        reject({
          errCode: 1,
          errMessage: "Invalid email address",
        })
      }
      const isExistEmail = await checkUserEmail(data)
      if (!isExistEmail) {
        reject({
          errCode: 1,
          errMessage: "Email address already exists",
        })
      }
      const hashPasswordFromBcrypt = await hashPassword(data.password)
      const newUser = await db.User.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashPasswordFromBcrypt,
        address: data.address,
      })
      resolve({
        errCode: 0,
        errMessage: "User created successfully",
        newUser
      })
    } catch (error) {
      console.error(error)
      reject({
        errCode: 2,
        errMessage: "Database error while creating user"
      })
    }
  })
}
module.exports = {
  handleUserLoginService: handleUserLoginService,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
  registerUserService, registerUserService
};
