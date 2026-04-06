const centerService = require('./center.service');

const getCenters = async (req, res, next) => {
  try {
    const data = await centerService.getAllCenters();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getCourts = async (req, res, next) => {
  try {
    const { centerId } = req.params;
    const data = await centerService.getCourtsByCenter(centerId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const postCenter = async (req, res, next) => {
  try {
    const data = await centerService.createCenter(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const postCourt = async (req, res, next) => {
  try {
    const { centerId } = req.params;
    const data = await centerService.createCourt(centerId, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCenters, getCourts, postCenter, postCourt };