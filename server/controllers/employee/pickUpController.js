const {pool} = require('../../configuration/dbConfig')

class PickUp{

    GetAllPickUpsOnTeacherClass(req, res) {
      let { teacherClasses } = req.body; // Assuming teacherClasses is an array or string passed in the request body.
  
      // If teacherClasses is a string, convert it to an array
      if (typeof teacherClasses === 'string') {
          teacherClasses = [teacherClasses];  // Convert the single element into an array
      }
  
      // Check if teacherClasses is an array and contains values
      if (!Array.isArray(teacherClasses) || teacherClasses.length === 0) {
          return res.status(400).json({
              status_code: 400,
              type: "error",
              message: "Invalid or empty teacherClasses provided",
          });
      }
  
      // Generate placeholders for the SQL query
      const placeholders = teacherClasses.map(() => '?').join(',');
  
      const sql = `
          SELECT 
              n.id AS pickup_id,
              u.phone_number AS phoneNumber,
              n.idNumber,
              n.relationship,
              n.action,
              n.note,
              n.created_at,
              n.updated_at,
              u.name AS parent_name,
              er.name AS student_name,
              er.id_class,
              c.name AS class_name  
          FROM nhat_ky_phu_huynh AS n
          INNER JOIN users AS u ON n.user_id = u.id
          INNER JOIN Role_PHHS AS r ON u.id = r.id_ph
          INNER JOIN enrollment_records AS er ON r.id_hs = er.id
          INNER JOIN class AS c ON er.id_class = c.id  
          WHERE er.id_class IN (${placeholders})
      `;
  
      pool.query(sql, teacherClasses, (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({
                  status_code: 500,
                  type: "error",
                  message: "Lỗi không thể lấy danh sách đưa đón. Vui lòng thử lại sau",
              });
          }
  
          const pickups = results.map((pickup) => ({
              pickupId: pickup.pickup_id,
              phoneNumber: pickup.phoneNumber,
              idNumber: pickup.idNumber,
              relationship: pickup.relationship,
              action: pickup.action,
              note: pickup.note,
              className: pickup.class_name,  // Use the class name
              createdAt: pickup.created_at,
              updatedAt: pickup.updated_at,
              parentName: pickup.parent_name,
              studentName: pickup.student_name,
          }));
  
          return res.status(200).json({
              status_code: 200,
              type: "success",
              message: "Thông tin đưa đón",
              data: pickups,
          });
      });
  }
 
    }
module.exports = new PickUp;