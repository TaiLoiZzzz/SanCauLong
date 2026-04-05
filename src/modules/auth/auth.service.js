const db = require('../../lib/db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../../utils/AppError');

class AuthService {
    async register ({email, password, fullName, phone}){
        const checkemailSql = 'SELECT * FROM "User" WHERE email = ? LIMIT 1   '
        const existingUser = await db.raw(checkemailSql,[email]) 
        if (existingUser.rows.length > 0) {
      throw new AppError(' này đã được đăng ký rồi!',401);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const insertSql = `
      INSERT INTO "User" (id, email, "fullName", "passwordHash", phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      RETURNING id, email, "fullName", role
    `;
    const result = await db.raw(insertSql,[userId, 
      email, 
      fullName, 
      passwordHash, 
      phone || null, 
      'USER']);
    return result.rows[0];
}
    async login (email, password){
        const checkemailSql = 'SELECT * FROM "User" WHERE email = ? LIMIT 1'
        const existingUser = await db.raw(checkemailSql,[email])
        const user = existingUser.rows[0]
        if(!user) throw new AppError("Chua dang ki!",401)
        const isMatch = await bcrypt.compare(password,user.passwordHash);
        if ( !isMatch) throw new AppError("Email hoac mat khau khong dung!",400)
        // 3. Tạo JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return {
      user: { 
        id: user.id, 
        email: user.email, 
        fullName: user.fullName, 
        role: user.role 
      },
      token
    }; 
    
    }

}

module.exports = new AuthService();