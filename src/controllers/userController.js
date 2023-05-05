import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    // console.log('your email: ' + email)
    let password = req.body.password;
    //check email user exist 
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
    return res.status(200).json({

        // errCode: 0,
        // message: 'Tui ten nghia',
        // yourEmail: email,
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
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
 * @param {Object} req - Đối tượng biểu diễn cho HTTP request
 * @param {Object} res - Đối tượng biểu diễn cho HTTP response
 */
let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}
/**
 * Xử lý cập nhật thông tin người dùng.
 * @param {Object} req - Đối tượng biểu diễn cho HTTP request
 * @param {Object} res - Đối tượng biểu diễn cho HTTP response
 */

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}
/**
 * This is a function that handles the deletion of a user.
 * @param {object} req - The request object, which contains the data sent by the client.
 * @param {object} res - The response object, which is used to send a response back to the client.
 * @returns {object} - The result message or an error response with a status code and error message.
 */
let handleDeleteUser = async (req, res) => {
    if (!(req.body.id)) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}
let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        console.log('Check data', data)
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get allcode error: ', e);
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
}