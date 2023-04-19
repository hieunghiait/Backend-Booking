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
 * export function 
 */
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
}