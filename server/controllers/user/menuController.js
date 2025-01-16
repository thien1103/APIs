const { pool } = require("../../configuration/dbConfig");

class Menu {
  async GetMenu(req, res) {
    try {
      // Define the SQL query with JOINs to get meal names, employee names, and sotien_chi
      const sql = `
        SELECT 
          td.grade, 
          td.date, 
          sa1.name AS bua_sang, 
          sa2.name AS bua_trua, 
          sa3.name AS bua_xe, 
          sa4.name AS bua_chieu, 
          td.so_luong, 
          pc.sotien_chi,
          CONCAT(n1.ho, ' ', n1.ten) AS nguoi_nau, 
          CONCAT(n2.ho, ' ', n2.ten) AS nguoi_duyet 
        FROM 
          thuc_don td
        LEFT JOIN suat_an_dinh_duong sa1 ON td.bua_sang = sa1.id
        LEFT JOIN suat_an_dinh_duong sa2 ON td.bua_trua = sa2.id
        LEFT JOIN suat_an_dinh_duong sa3 ON td.bua_xe = sa3.id
        LEFT JOIN suat_an_dinh_duong sa4 ON td.bua_chieu = sa4.id
        LEFT JOIN nhan_vien n1 ON n1.ma_nv = CONCAT('NV0', td.nguoi_nau)
        LEFT JOIN nhan_vien n2 ON n2.ma_nv = CONCAT('NV0', td.nguoi_duyet)
        LEFT JOIN quan_ly_chi pc ON td.id_phieu_chi = pc.id  
      `;

      // Execute the query
      pool.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: err.message,
          });
        }

        // Prepare the response data
        const items = results.map((item) => ({
          grade: item.grade,
          date: item.date,
          bua_sang: item.bua_sang,
          bua_trua: item.bua_trua,
          bua_xe: item.bua_xe,
          bua_chieu: item.bua_chieu,
          so_luong: item.so_luong,
          da_chi: item.sotien_chi, // Include sotien_chi
          nguoi_nau: item.nguoi_nau, // Name from nhan_vien
          nguoi_duyet: item.nguoi_duyet, // Name from nhan_vien
        }));

        // Send the response
        return res.status(200).json({
          status_code: 200,
          type: "success",
          data: {
            items: items,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({
        status_code: 500,
        type: "error",
        message: error.message,
      });
    }
  }

  async GetMenuByGrade(req, res) {
    try {
      // Get the grade from request body
      const { grade } = req.body;

      // Define the SQL query with JOINs to get meal names, employee names, and sotien_chi
      const sql = `
        SELECT 
          td.grade, 
          td.date, 
          sa1.name AS bua_sang, 
          sa2.name AS bua_trua, 
          sa3.name AS bua_xe, 
          sa4.name AS bua_chieu, 
          td.so_luong, 
          pc.sotien_chi,  
          CONCAT(n1.ho, ' ', n1.ten) AS nguoi_nau, 
          CONCAT(n2.ho, ' ', n2.ten) AS nguoi_duyet 
        FROM 
          thuc_don td
        LEFT JOIN suat_an_dinh_duong sa1 ON td.bua_sang = sa1.id
        LEFT JOIN suat_an_dinh_duong sa2 ON td.bua_trua = sa2.id
        LEFT JOIN suat_an_dinh_duong sa3 ON td.bua_xe = sa3.id
        LEFT JOIN suat_an_dinh_duong sa4 ON td.bua_chieu = sa4.id
        LEFT JOIN nhan_vien n1 ON n1.ma_nv = CONCAT('NV0', td.nguoi_nau)
        LEFT JOIN nhan_vien n2 ON n2.ma_nv = CONCAT('NV0', td.nguoi_duyet)
        LEFT JOIN quan_ly_chi pc ON td.id_phieu_chi = pc.id  
        WHERE 
          td.grade = ?
      `;

      // Execute the query
      pool.query(sql, [grade], (err, results) => {
        if (err) {
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: err.message,
          });
        }

        // Prepare the response data
        const items = results.map((item) => ({
          grade: item.grade,
          date: item.date,
          bua_sang: item.bua_sang,
          bua_trua: item.bua_trua,
          bua_xe: item.bua_xe,
          bua_chieu: item.bua_chieu,
          so_luong: item.so_luong,
          da_chi: item.sotien_chi, // Include sotien_chi
          nguoi_nau: item.nguoi_nau, // Name from nhan_vien
          nguoi_duyet: item.nguoi_duyet, // Name from nhan_vien
        }));

        // Send the response
        return res.status(200).json({
          status_code: 200,
          type: "success",
          data: {
            items: items,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({
        status_code: 500,
        type: "error",
        message: error.message,
      });
    }
  }
}

module.exports = new Menu();
