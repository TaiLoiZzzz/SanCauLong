const db = require('../../lib/db');
const AppError = require('../../utils/AppError');

class CenterService {
  // Validate center
  validateCenterData(data) {
    const { name, address, description, imageUrl } = data;

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new AppError('Tên cụm sân là bắt buộc!', 400);
    }

    if (name.trim().length < 3 || name.trim().length > 100) {
      throw new AppError('Tên cụm sân phải từ 3 đến 100 ký tự!', 400);
    }

    if (!address || typeof address !== 'string' || !address.trim()) {
      throw new AppError('Địa chỉ là bắt buộc!', 400);
    }

    if (address.trim().length < 5 || address.trim().length > 255) {
      throw new AppError('Địa chỉ phải từ 5 đến 255 ký tự!', 400);
    }

    if (description && typeof description !== 'string') {
      throw new AppError('Mô tả phải là chuỗi!', 400);
    }

    if (imageUrl && typeof imageUrl !== 'string') {
      throw new AppError('imageUrl phải là chuỗi!', 400);
    }

    if (imageUrl) {
      const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
      if (!urlRegex.test(imageUrl)) {
        throw new AppError('imageUrl không hợp lệ!', 400);
      }
    }
  }

  // Validate court
  validateCourtData(centerId, data) {
    const { name, pricePerHour } = data;

    if (!centerId || typeof centerId !== 'string' || !centerId.trim()) {
      throw new AppError('centerId là bắt buộc!', 400);
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new AppError('Tên sân là bắt buộc!', 400);
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      throw new AppError('Tên sân phải từ 2 đến 100 ký tự!', 400);
    }

    if (pricePerHour === undefined || pricePerHour === null || pricePerHour === '') {
      throw new AppError('Giá theo giờ là bắt buộc!', 400);
    }

    if (isNaN(pricePerHour)) {
      throw new AppError('Giá theo giờ phải là số!', 400);
    }

    if (Number(pricePerHour) <= 0) {
      throw new AppError('Giá theo giờ phải lớn hơn 0!', 400);
    }
  }

  // getAllCenter
  getAllCenter = async () => {
    const result = await db.raw(
      `SELECT * FROM "CourtCenter" ORDER BY updated_at DESC;`
    );
    console.log(result.rows )
    return result.rows;
  };

  getCourtByCenterId = async (centerId) => {
    if (!centerId || typeof centerId !== 'string' || !centerId.trim()) {
      throw new AppError('centerId không hợp lệ!', 400);
    }

    const result = await db.raw(
      'SELECT * FROM "Court" WHERE "courtCenterId" = ?',
      [centerId]
    );

    return result.rows;
  };

  createCenter = async (data) => {
    this.validateCenterData(data);

    const { name, address, description, imageUrl } = data;

    // check trùng tên
    const existed = await db.raw(
      `SELECT * FROM "CourtCenter" WHERE LOWER(name) = LOWER(?) LIMIT 1`,
      [name.trim()]
    );

    if (existed.rows.length > 0) {
      throw new AppError('Cụm sân này đã tồn tại!', 409);
    }

    const result = await db.raw(
      `
      INSERT INTO "CourtCenter" ("name", "address", "description", "imageUrl")
      VALUES (?, ?, ?, ?)
      RETURNING *
      `,
      [
        name.trim(),
        address.trim(),
        description ? description.trim() : null,
        imageUrl ? imageUrl.trim() : null
      ]
    );

    return result.rows[0];
  };

  createCourt = async (centerId, data) => {
    this.validateCourtData(centerId, data);

    const { name, pricePerHour } = data;

    // check center tồn tại
    const center = await db.raw(
      `SELECT * FROM "CourtCenter" WHERE id = ? LIMIT 1`,
      [centerId]
    );

    if (center.rows.length === 0) {
      throw new AppError('Cụm sân không tồn tại!', 404);
    }

    // check tên sân trùng trong cùng cụm
    const existedCourt = await db.raw(
      `
      SELECT * FROM "Court"
      WHERE "courtCenterId" = ?
      AND LOWER(name) = LOWER(?)
      LIMIT 1
      `,
      [centerId, name.trim()]
    );

    if (existedCourt.rows.length > 0) {
      throw new AppError('Sân này đã tồn tại trong cụm!', 409);
    }

    const result = await db.raw(
      `
      INSERT INTO "Court" ("name", "pricePerHour", "courtCenterId")
      VALUES (?, ?, ?)
      RETURNING *
      `,
      [name.trim(), Number(pricePerHour), centerId]
    );

    return result.rows[0];
  };
}

module.exports = new CenterService();