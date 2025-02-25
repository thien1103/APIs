const {pool} = require('../../configuration/dbConfig')

class PickUp{

    //Hàm lấy danh sách tất cả các lượt đón-đưa
    GetAllPickUpsEachUser(req,res){
      const {userId} = req.body;
        const sql = 'SELECT n.id, n.user_id, u.phone_number AS phoneNumber, n.idNumber, n.relationship, n.action, n.note, u.name FROM nhat_ky_phu_huynh as n INNER JOIN users as u ON n.user_id = u.id WHERE u.id = ?';
        pool.query(sql, [userId], (err, results) => {
            if (err) {
            console.error(err);
            return res.status(500).json({status_code: 500, type:"error", message:"Lỗi không thể lấy danh sách đưa đón. Vui lòng thử lại sau"});
            }

            const pickups = results.map((pickup) => ({
              id: pickup.id,
              userId: pickup.user_id,
              name: pickup.name,
              phoneNumber: pickup.phoneNumber,
              relationship: pickup.relationship,
              idNumber: pickup.idNumber,
              action: pickup.action,
              note: pickup.note,
            }));

            return res.status(200).json({status_code: 200, type:"success", message:"Thông tin đưa đón", data: pickups});
        });
    }


//Hàm lấy thông tin chi tiết lượt đón đưa
GetDetailPickup(req,res){
  const {pickupId} = req.params;
    const sql = 'SELECT n.id, n.user_id, u.phone_number AS phoneNumber, n.idNumber, n.relationship, n.action, n.note, u.name FROM nhat_ky_phu_huynh as n INNER JOIN users as u ON n.user_id = u.id WHERE n.id = ?';
    pool.query(sql, [pickupId], (err, results) => {
        if (err) {
        console.error(err);
        return res.status(500).json({status_code: 500, type:"error", message:"Lỗi không thể lấy danh sách đưa đón. Vui lòng thử lại sau"});
        }

        const pickups = results.map((pickup) => ({
          id: pickup.id,
          userId: pickup.user_id,
          name: pickup.name,
          phoneNumber: pickup.phoneNumber,
          relationship: pickup.relationship,
          idNumber: pickup.idNumber,
          action: pickup.action,
          note: pickup.note,
        }));

        return res.status(200).json({status_code: 200, type:"success", message:"Thông tin đưa đón", data: pickups});
    });
}
    
  

    //Hàm để tạo pick up trẻ
    CreatePickUp(req,res){
        const { userId, relationship, idNumber, action, note } = req.body;
        const created_at = new Date();
        // Kiểm tra dữ liệu đầu vào
        if (!userId || !idNumber || !relationship || !action) {
          return res.status(400).json({status_code: 400, type:"error", message:"Vui lòng điền đầy đủ thông tin"});
        }
    
        const sql = 'INSERT INTO nhat_ky_phu_huynh (user_id, relationship, idNumber, action, note, created_at) VALUES (?, ?, ?, ?, ?, ?)';
        pool.query(
          sql,
          [userId, relationship, idNumber, action, note, created_at],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({status_code: 500, type:"error", message:"Lỗi không thể thêm thông tin đưa đón. Vui lòng thử lại sau"});
            }
    
           return res.status(200).json({status_code: 200, type:"success", message:"Thêm thông tin đưa đón thành công"});
          }
        );
      }

      //Hàm Update đón-đưa 
      UpdatePickUp(req, res) {
        const { pickupId } = req.params;
        const { relationship, idNumber, action, note } = req.body;
      

        if (!pickupId) {
          return res.status(404).json({status_code: 404, type:"error", message:"Lỗi không tìm thấy pick up ID"});
        }
      
        const sql = 'UPDATE nhat_ky_phu_huynh SET relationship = ?, idNumber = ?, action = ?, note = ? WHERE id = ?';
        pool.query(
          sql,
          [relationship, idNumber, action, note, pickupId],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({status_code: 500, type:"error", message:"Lỗi không thể cập nhật thông tin đưa đón. Vui lòng thử lại sau"});
            }
      
            if (result.affectedRows === 0) {
              return res.status(404).json({status_code: 404, type:"error", message:"Không tìm thấy thông tin đưa đón với ID này"});
            }
      
            return res.status(200).json({status_code: 200, type:"success", message:"Cập nhật thông tin đưa đón thành công"});
          }
        );
      }

      //Hàm xóa thông tin pick up
      DeletePickUp(req, res) {
        const { pickupId } = req.params;
      
        const sql = 'DELETE FROM nhat_ky_phu_huynh WHERE id = ?';
        pool.query(
          sql,
          [pickupId],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
            }
      
            if (result.affectedRows === 0) {
              return res.status(404).json({status_code: 404, type:"error", message:"Thông tin đưa đón không tồn tại"});
            }
      
            return res.status(200).json({status_code: 200, type:"success", message:"Thông tin đưa đón được xóa thành công"});
          }
        );
      }
    }
module.exports = new PickUp;