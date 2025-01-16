const { pool } = require("../../configuration/dbConfig");

class Nutrition {
  async GetNutritionByUserAge(req, res) {
    const { userId } = req.params; // Assuming userId comes in the request body

    const ageSql = `
      SELECT YEAR(CURDATE()) - YEAR(e.birth_date) AS age
      FROM users AS u
      INNER JOIN Role_PHHS AS r ON u.id = r.id_ph
      INNER JOIN enrollment_records AS e ON r.id_hs = e.id
      WHERE u.id = ?
    `;

    pool.query(ageSql, [userId], (err, ageResults) => {
      if (err) {
        console.error("Error executing age query:", err);
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Internal server error",
        });
      }

      if (ageResults.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Không tìm thấy dữ liệu ngày sinh cho user này ",
        });
      }

      const age = ageResults[0].age; // Get the age from the results

      const nutritionSql = `
        SELECT 
          n.nang_luong, 
          n.protein, 
          n.can_xi, 
          n.sat, 
          n.vitammin_a, 
          n.vitamin_b1, 
          n.vitamin_b2, 
          n.vitamin_b3, 
          n.vitamin_c, 
          n.note
        FROM nhu_cau_dinh_duong AS n
        WHERE n.age = ?
      `;

      // Now query the nhu_cau_dinh_duong table using the calculated age
      pool.query(nutritionSql, [age], (err, nutritionResults) => {
        if (err) {
          console.error("Error executing nutrition query:", err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Internal server error",
          });
        }

        if (nutritionResults.length === 0) {
          return res.status(404).json({
            status_code: 404,
            type: "error",
            message: "Nhu cầu dinh dưỡng không tồn tại cho độ tuổi này",
          });
        }

        res
          .status(200)
          .json({ status_code: 200, type: "success", data: nutritionResults });
      });
    });
  }
}

module.exports = new Nutrition();
