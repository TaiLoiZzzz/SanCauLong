const jwt = require('jsonwebtoken');
const  AppError = require('../utils/AppError'); // Giả định bạn có class xử lý lỗi

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication invalid',403));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    

    req.user = { 
      userId: payload.userId, 
      role: payload.role 
    };
    
    next();
  } catch (error) {
    return next(new AppError('Authentication invalid',403));
  }
}
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Unauthorized to access this route',403));
    }
    next();
  }
}
module.exports = {protect, authorizeRoles}