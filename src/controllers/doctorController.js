import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!Number.isInteger(Number(limit))) {
    limit = 10; //hard limit
  }
  try {
    let doctors = await doctorService.getTopDoctorHomeService(+limit);
    return res.status(200).json(doctors);
  } catch (error) {
    console.log("Show log error: " + error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctorsService();
    return res.status(200).json(doctors);
  } catch (error) {
    console.log('Show log getAllDoctors error: ' + error.message);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Failed to retrieve doctors",
    });
  }
};

let postInforDoctor = async (req, res) => {
  try {
    let respone = await doctorService.saveDetailInformationDoctor(req.body);
    return res.status(200).json(respone);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getThongTinDoctorById = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({
        error: 3,
        errMessage: "Missing request id",
      })
    }
    let info = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: -1,
      errMessage: "Error from the server",
    });
  }
};
let bulkCreateSchedule = async (req, res) => {
  try {
    let info = await doctorService.bulkCreateSChedule(req.body);
    console.log('Show log data info: ' + info)
    return res.status(200).json(info)
  } catch (error) {
    console.log('Show log error: ' + error)
    return res.status(500).json({
      error: -1,
      errMessage: 'Internal Server Error',
    })
  }
}
let getScheduleByDate = async (req, res) => {
  try {
    let info = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
    console.log('Show log data info: ' + info)
    return res.status(200).json(info)
  } catch (error) {
    console.log('Show log error: ' + error)
    return res.status(500).json({
      error: -1,
      errMessage: 'Internal Server Error',
    })
  }
}
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInforDoctor: postInforDoctor,
  getThongTinDoctorById: getThongTinDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
};
