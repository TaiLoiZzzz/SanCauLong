const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function(knex) {
  console.log('--- Đang dọn dẹp và nạp dữ liệu mẫu ---');

  // 1. Xóa dữ liệu cũ (Xóa từ bảng con trước, bảng cha sau để tránh lỗi khóa ngoại)
  await knex('Booking').del();
  await knex('Slot').del();
  await knex('Court').del();
  await knex('CourtCenter').del();
  await knex('User').del();

  // 2. Tạo mật khẩu mã hóa
  const saltRounds = 10;
  const hashedPw = await bcrypt.hash('admin123', saltRounds);

  // 3. Chèn User Admin
  const [admin] = await knex('User').insert({
    id: uuidv4(),
    email: 'admin@sancaulong.com',
    fullName: 'Lợi Admin',
    passwordHash: hashedPw,
    role: 'ADMIN'
  }).returning('*');

  // 4. Chèn Cụm Sân
  const [center] = await knex('CourtCenter').insert({
    id: uuidv4(),
    name: 'Smash It Center Q9',
    address: '123 Lê Văn Việt, Quận 9',
    description: 'Sân cầu lông tiêu chuẩn quốc tế.'
  }).returning('*');

  // 5. Chèn Sân con
  const [court1] = await knex('Court').insert({
    id: uuidv4(),
    name: 'Sân số 1',
    pricePerHour: 80000,
    courtCenterId: center.id
  }).returning('*');

  // 6. Chèn vài Slot mẫu cho hôm nay
  const today = new Date();
  today.setMinutes(0, 0, 0);

  const slots = [
    { id: uuidv4(), courtId: court1.id, startTime: new Date(today.setHours(8)), endTime: new Date(today.setHours(9)), isBooked: false },
    { id: uuidv4(), courtId: court1.id, startTime: new Date(today.setHours(9)), endTime: new Date(today.setHours(10)), isBooked: false },
  ];

  await knex('Slot').insert(slots);

  console.log('✅ Seed dữ liệu thành công!');
};