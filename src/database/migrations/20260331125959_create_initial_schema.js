/**
 * @param { import("knex").Knex } knex
 */
exports.up = function(knex) {
  return knex.schema
    // 1. Bảng User
    .createTable('User', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('email').unique().notNullable();
      table.string('fullName').notNullable();
      table.string('passwordHash').notNullable();
      table.string('phone');
      table.enum('role', ['USER', 'ADMIN', 'STAFF']).defaultTo('USER');
      table.timestamps(true, true); // created_at, updated_at
    })
    // 2. Bảng CourtCenter (Cụm sân)
    .createTable('CourtCenter', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('address').notNullable();
      table.text('description');
      table.string('imageUrl');
      table.timestamps(true, true);
    })
    // 3. Bảng Court (Sân con)
    .createTable('Court', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.float('pricePerHour').notNullable();
      table.uuid('courtCenterId').references('id').inTable('CourtCenter').onDelete('CASCADE');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    })
    // 4. Bảng Slot (Khung giờ)
    .createTable('Slot', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.timestamp('startTime').notNullable();
      table.timestamp('endTime').notNullable();
      table.boolean('isBooked').defaultTo(false);
      table.uuid('courtId').references('id').inTable('Court').onDelete('CASCADE');
    })
    // 5. Bảng Booking (Đặt sân)
    .createTable('Booking', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.float('totalPrice').notNullable();
      table.enum('status', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).defaultTo('PENDING');
      table.uuid('userId').references('id').inTable('User').onDelete('RESTRICT');
      table.uuid('slotId').unique().references('id').inTable('Slot').onDelete('RESTRICT');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  // Xóa theo thứ tự ngược để tránh lỗi khóa ngoại
  return knex.schema
    .dropTableIfExists('Booking')
    .dropTableIfExists('Slot')
    .dropTableIfExists('Court')
    .dropTableIfExists('CourtCenter')
    .dropTableIfExists('User');
};