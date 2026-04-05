const authService = require('./auth.service');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'Đăng ký thành công!', user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json({ message: 'Đăng nhập thành công!', ...data });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };