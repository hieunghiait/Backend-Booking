import db from "../models/index";
/**
 *
 * @param {*} limit
 * @returns
 */
let getTopDoctorHomeService = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("abc", limit);
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: "R2" },
                //Sắp xếp theo ngày tạo giảm dần
                order: [["createdAt", "DESC"]],
                //Loại bỏ trường password
                attributes: {
                    exclude: ["password", "image"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn, valueVi"],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
};
let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: { exclude: ["password", "image"] },
            });
            resolve({ errCode: 0, data: doctors });
        } catch (error) {
            reject(error);
        }
    });
};
/**
 *
 * @param {object} inputData
 * @returns
 */
let saveDetailInformationDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            1;
            if (
                !inputData.id ||
                !inputData.contentHTML ||
                !inputData.contentMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter",
                });
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                });
                resolve({
                    errCode: 0,
                    errMessage: "Save information doctor sucessfully",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                })
            } else {
                /**
                 *  SELECT * FROM User WHERE User.id = id
                 */
                let data = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    //ignore 
                    attributes: {
                        exclude: ["password", "image"],
                    },
                    include: [{
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown'],
                    },
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    }],
                    raw: true,
                    nest: true,
                })
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctorsService: getAllDoctorsService,
    saveDetailInformationDoctor: saveDetailInformationDoctor,
    getDetailDoctorById: getDetailDoctorById,
};
