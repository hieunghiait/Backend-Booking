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
    console.log('Show log getAllDoctors error: ');
    return res.status(500).json({
      errCode: -1,
      errMessage: "Failed to retrieve doctors",
    });
  }
};

let saveInformationDoctor = async (req, res) => {
  try {
    let userInfo = await doctorService.saveDetailInformationDoctorService(req.body);
    return res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
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
    return res.status(400).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let bulkCreateSchedule = async (req, res) => {
  try {
    let info = await doctorService.bulkCreateScheduleService(req.body);
    return res.status(200).json(info)
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Internal Server Error',
    })
  }
}
let getScheduleByDate = async (req, res) => {
  try {
    let info = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
    return res.status(200).json(info)
  } catch (error) {
    console.log('Show log error: ' + error)
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Internal Server Error',
    })
  }
}
let getAllDoctorsInformation = async (req, res) => {
  try {
    let data = await doctorService.getAllDoctorsInformationService()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: error.message
    })
  }
}
let getExtraInforDoctorById = async (req, res) => {
  try {
    let dataInfor = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId)
    return res.status(200).json(dataInfor)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errCode: -1,
      errMessage: error.message
    })
  }
}

let getProfileDoctorById = async (req, res) => {
  try {
    let dataInfor = await doctorService.getProfileDoctorById(req.query.doctorId)
    return res.status(200).json(dataInfor)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errCode: -1,
      errMessage: error.message
    })
  }
}
let postBookAppointment = async (req, res) => { }

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveInformationDoctor: saveInformationDoctor,
  getThongTinDoctorById: getThongTinDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getAllDoctorsInformation: getAllDoctorsInformation,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  postBookAppointment: postBookAppointment
}
