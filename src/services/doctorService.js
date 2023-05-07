import db from "../models/index";
/**
 * 
 * @param {*} limit 
 * @returns 
 */
let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                //Sắp xếp theo ngày tạo giảm dần
                order: [['createdAt', 'DESC']],
                //Loại bỏ trường password
                attributes: {
                    exclude: ['password', 'image']
                },
                include: [
                    { module: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { module: db.Allcode, as: 'genderData', attributes: ['valueEn, valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password', 'image'] }
            })
            resolve({ errCode: 0, data: doctors })
        } catch (error) { reject(error); }
    })
}
/**
 * 
 * @param {object} inputData 
 * @returns 
 */
let postInforDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.id || inputData.contentHTML || inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                })
            } else {
                await db.Markdown.save({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save information doctor sucessfully'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctorsService: getAllDoctorsService
}