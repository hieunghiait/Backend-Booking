import { emit } from "nodemon";
import db from "../models/index";
import bcrypt, { encodeBase64, hash } from "bcryptjs";
import user from "../models/user";
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
            "token",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Login sucessfully";
            delete user.password;
            userData.user = user;
            userData.token = jwt.sign({ email }, "hieunghia", {
              expiresIn: "2h",
            });
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
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      console.log('Show log error: ' + e.message);
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
            //ignore password
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
      // if (!data.email || !data.password || !data.firstName || !data.lastName || !data.phonenumber || !data.address) {
      //     resolve({
      //         errCode: 1,
      //         errMessage: "Missing required fields"
      //     });
      //     return;
      // }
      const isValidEmail = validateEmail(data.email);
      const isValidPhoneNumber = validatePhoneNumber(data.phonenumber);
      // if (!isValidEmail) {
      //     resolve({
      //         errCode: 1,
      //         errMessage: 'Invalid email address',
      //     });
      //     return;
      // }
      if (!isValidPhoneNumber) {
        resolve({
          errCode: 1,
          errMessage: "Invalid phone number",
        });
        return;
      }
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in use, Please try another email",
        });
      } else {
        const tokenUser = jwt.sign({ email: data.email }, "hieunghia", {
          expiresIn: "2h",
        });
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        const user = await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          // gender: data.gender === "1" ? true : false,
          roleId: 'R2',
          // positionId: data.positionId,
          // image: data.avatar,
          // token: tokenUser,
        });

        // console.log('log token: ', tokenUser)
        // user.token = tokenUser;
      }
      resolve({
        errCode: 0,
        errMessage: "User created successfully",
      });
    } catch (exception) {
      console.log(exception);
      reject(exception);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundUser = await db.User.findOne({
        where: { id: userId },
      });
      if (!foundUser) {
        resolve({
          errCode: 2,
          errMessage: `The user isn't exist`,
        });
      }
      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errCode: 0,
        errMessage: `The user is deleted`,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  console.log("check data.id: ", data.id);
  console.log("log data", data);
  console.log("log phone: ", data.phonenumber);
  return new Promise(async (resolve, reject) => {
    try {
      //data.id || data.roleId || positionId || data.gender // 60
      if (
        // !Number.isInteger(Number(data.)) ||
        !data.email ||
        !data.firstName ||
        !data.lastName ||
        !data.address
      ) {
        resolve({
          errCode: 2,
          errMessage: "Missing require parameters",
        });
      }
      // Query the database to find the user with matching id
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
          message: "User update successful",
        });
      } else {
        resolve({
          errCode: 1,
          message: `No user found with ID ${data.id}`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
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
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
};
