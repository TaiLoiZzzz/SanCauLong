require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql', // Thay đổi từ sqlite3 sang postgresql
    connection: process.env.DATABASE_URL, // Sử dụng biến môi trường từ file .env
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations' // Nơi chứa file tạo bảng
    },
    seeds: {
      directory: './src/database/seeds' // Nơi chứa file nạp dữ liệu mẫu
    }
  },

  // Staging và Production có thể để sau, quan trọng là development phải chạy được
};