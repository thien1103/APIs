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
      
        // Trim the userId value to remove any leading/trailing spaces
        const trimmedUserId = userId.trim();
      
        // Check if trimmedUserId is provided and not an empty string
        if (!trimmedUserId) {
          return res.status(400).json({ error: 'Vui lòng cung cấp userId' });
        }
      
        const query = 'UPDATE pickups SET userId = ?, phoneNumber = ?, relationship = ?, idNumber = ?, action = ?, note = ? WHERE pickupId = ?';
        connection.query(
          query,
          [trimmedUserId, phoneNumber, relationship, idNumber, action, note, pickupId],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Lỗi: Không thể cập nhật thông tin đưa đón, vui lòng thử lại sau' });
            }
      
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: 'Không tìm thấy thông tin đưa đón với id này' });
            }
      
            return res.json({ message: 'Thông tin đưa đón đã được cập nhật thành công' });
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
              return res.status(500).json({ error: 'Lỗi: Không thể xóa đưa đón, vui lòng thử lại sau' });
            }
      
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: 'Không tìm thấy thông tin đưa đón với id này' });
            }
      
            return res.json({ message: 'Đưa đón đã được xóa thành công' });
          }
        );
      }
    }
module.exports = new PickUp;