import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password", "address", "email", "gender", "phonenumber", "createdAt", "updatedAt"]
                },
                include: [
                    {
                        model: db.Allcode, as: "positionData", attributes: ["valueVi"]
                    },
                    {
                        model: db.Allcode, as: "genderData", attributes: ["valueVi"]
                    }
                ],
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: { exclude: ["password"] },
            });
            resolve({ errCode: 0, data: doctors });
        } catch (error) {
            reject(error);
        }
    });
};
let saveDetailInformationDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !inputData.doctorId ||
                !inputData.contentHTML ||
                !inputData.contentMarkdown ||
                !inputData.action ||
                !inputData.selectedPrice ||
                !inputData.selectedPayment ||
                !inputData.selectedProvince ||
                !inputData.nameClinic ||
                !inputData.addressClinic ||
                !inputData.note) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter",
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedProvinceId;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    await doctorInfor.save();
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvinceId,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save information doctor sucessfully",
                });
            }
        } catch (error) {
            console.log(error)
            reject(error)
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
                let data = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    attributes: {
                        //bo truong image #69 
                        exclude: ["password"],
                    },
                    include: [{
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown'],
                    },
                    {
                        model: db.Allcode, as: "positionData", attributes: ["valueVi"]
                    },
                        // {
                        //     model: db.Doctor_Infor,
                        //     attributes: {
                        //         exclude: ['id', 'doctorId']
                        //     },
                        //     include: [
                        //         {
                        //             model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi']
                        //         },
                        //         {
                        //             model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi']
                        //         },
                        //         {
                        //             model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi']
                        //         },
                        //     ]
                        // },
                    ],
                    raw: true,
                    nest: true,
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {};
                }
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
let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                let existing = await db.Schedule.findAll(
                    {
                        where: {
                            doctorId: data.doctorId,
                            date: data.formatedDate
                        },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                );
                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime();
                        return time;
                    })
                }
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                //create data 
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                })
            }
        } catch (error) {
            console.log('Show log error: ' + error)
            reject(error);
        }
    })
}
let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    // attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    include:
                        [
                            {
                                model: db.Allcode, as: 'timeTypeData', attributes: ['valueVi']
                            },
                        ],
                    raw: false,
                    nest: true,
                })
                if (!data) {
                    data = [];
                }
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
let getAllDoctorsInformationService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Doctor_Infor.findAll({
                include: [{
                    model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi']
                }]
            })
            resolve({
                errCode: 0,
                data: data
            })
        } catch (error) {
            console.log(error)
            reject({
                errCode: -1,
                errMessage: error,
            });
        }
    });
};
let getExtraInforDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                })
            } else {
                let dataDoctor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                })
                if (!dataDoctor) {
                    dataDoctor = {};
                }
                resolve({
                    errCode: 0,
                    data: dataDoctor,
                })
            }
        } catch (error) {
            console.log(error)
            reject({
                errCode: -1,
                errMessage: error,
            })
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            }, include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi'] }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true,
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            console.log(error)
            reject({
                errCode: -1,
                errMessage: error.message
            })
        }
    })
}
module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctorsService: getAllDoctorsService,
    saveDetailInformationDoctorService: saveDetailInformationDoctorService,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getAllDoctorsInformationService, getAllDoctorsInformationService,
    getExtraInforDoctorByIdService: getExtraInforDoctorByIdService,
    getProfileDoctorById: getProfileDoctorById,
}
