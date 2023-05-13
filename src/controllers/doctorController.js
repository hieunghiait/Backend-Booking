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
        let doctors = await doctorService.getTopDoctorHomeService(+limit);
        return res.status(200).json(doctors)
    } catch (error) {
        console.log('log error: ' + error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
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
    try {
        let respone = await doctorService.saveDetailInformationDoctor(req.body)
        return res.status(200).json(respone);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server',
        })
    }
}
let getThongTinDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(info)
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            error: -1,
            errMessage: 'Error from the server',
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor,
    getThongTinDoctorById: getThongTinDoctorById,
}