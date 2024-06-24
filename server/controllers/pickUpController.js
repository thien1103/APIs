const {connection} = require('../configuration/dbConfig')

class PickUp{

    //Hàm lấy danh sách tất cả các lượt đón-đưa
    GetAllPickUps(req,res){
        const query = 'SELECT * FROM pickups';
        connection.query(query, (err, results) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi: Không thể lấy danh sách đưa đón' });
            }

            const pickups = results.map(pickup => ({
            userId: pickup.userId,
            phoneNumber: pickup.phoneNumber,
            relationship: pickup.relationship,
            idNumber: pickup.idNumber,
            action: pickup.action,
            note: pickup.note
            }));

            return res.json({ pickups });
        });
    }

    //Hàm để tạo pick up trẻ
    CreatePickUp(req,res){
        const { userId, phoneNumber, relationship, idNumber, action, note } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !phoneNumber || !relationship || !action) {
          return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }
    
        const query = 'INSERT INTO pickups (userId, phoneNumber, relationship, idNumber, action, note) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(
          query,
          [userId, phoneNumber, relationship, idNumber, action, note],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Lỗi: Không thể thêm đưa đón, vui lòng thử lại sau' });
            }
    
           return res.json({ message: 'Thêm đưa đón thành công' });
          }
        );
      }

      //Hàm Update đón-đưa 
      UpdatePickUp(req, res) {
        const { pickupId } = req.params;
        const { userId, phoneNumber, relationship, idNumber, action, note } = req.body;
      
        //Dùng hàm Trim cho biến userId để xóa khoảng trống
        const trimmedUserId = userId.trim();
      
        // check biến trimmedUserId sau khi đã xóa khoảng trống xem còn khoảng trống không
        if (!trimmedUserId) {
          return res.status(404).json({status_code: 404, type:"error", message:"Lỗi không tìm thấy ID người dùng"});
        }
      
        const query = 'UPDATE pickups SET userId = ?, phoneNumber = ?, relationship = ?, idNumber = ?, action = ?, note = ? WHERE pickupId = ?';
        connection.query(
          query,
          [trimmedUserId, phoneNumber, relationship, idNumber, action, note, pickupId],
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
      
        const query = 'DELETE FROM pickups WHERE pickupId = ?';
        connection.query(
          query,
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