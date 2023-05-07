import doctorService from "../services/doctorService";
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10; //mặc định set cứng gán 10
    }
    try {
        let doctors = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi phía sever...'
        })
    }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsService();
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
/**
 * Lưu thông tin của Bác sĩ
 * @param {*} req 
 * @param {*} res 
 * @returns JSON 
 */
let postInforDoctor = async (req, res) => {
    let respone = await doctorService.getAllDoctorsService(req.body)
    return res.status(200).json(respone);
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor
}