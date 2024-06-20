const {connection} = require('../configuration/dbConfig')
const moment = require('moment')

class Request{
    AddLeaveRequest(req,res){
        const { title, startDateTime, endDateTime, content, status, userId } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!title || !startDateTime || !endDateTime || !content || !status || !userId) {
            return res.status(400).json({ error: 'Lỗi: Thiếu dữ liệu bắt buộc' });
        }

        // Chuyển đổi định dạng datetime
        const start = moment(startDateTime).format('YYYY-MM-DD HH:mm:ss');
        const end = moment(endDateTime).format('YYYY-MM-DD HH:mm:ss');

        // Thêm yêu cầu xin nghỉ vào cơ sở dữ liệu
        const query = 'INSERT INTO requests (title, startDateTime, endDateTime, content, status, userId) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [title, start, end, content, status, userId], (err, result) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi: Không thể gửi yêu cầu xin nghỉ' });
            }

            return res.json({ message: 'Yêu cầu xin nghỉ đã được gửi thành công' });
        });
    }

    //Hàm Update yêu cầu nghỉ phép
    UpdateLeaveRequest(req, res) {
        const { requestId } = req.params;
        const { title, startDateTime, endDateTime, content, status, userId } = req.body;
      
        try {
          connection.query(
            'UPDATE requests SET title = ?, startDateTime = ?, endDateTime = ?, content = ?, status = ? WHERE requestId = ? AND userId = ?',
            [title, startDateTime, endDateTime, content, status, requestId, userId],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Lỗi: Không thể cập nhật thông tin yêu cầu xin nghỉ, vui lòng thử lại sau' });
              }
      
              if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Không tìm thấy yêu cầu nghỉ phép' });
              }
      
              res.json({ message: 'Thông tin yêu cầu xin nghỉ đã được cập nhật thành công' });
            }
          );
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Lỗi: Không thể cập nhật thông tin yêu cầu xin nghỉ, vui lòng thử lại sau' });
        }
      }

        //Hàm xóa yêu cầu nghỉ phép
        DeleteLeaveRequest(req, res) {
            const { requestId } = req.params;
          
            try {
              connection.query('DELETE FROM requests WHERE requestId = ?', [requestId], 
              (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Lỗi: Không thể xóa yêu cầu xin nghỉ, vui lòng thử lại sau' });
                  }
          
                  if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy yêu cầu nghỉ phép' });
                  }
          
                  res.json({ message: 'Yêu cầu xin nghỉ đã được xóa thành công' });
                }
              );
            } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Lỗi: Không thể xóa yêu cầu xin nghỉ, vui lòng thử lại sau' });
            }
          }

          //Hàm lấy danh sách tất cả leave-request 
          GetAllLeaveRequests(req, res) {
            try {
              connection.query('SELECT * FROM requests', (err, results) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: 'Lỗi: Không thể lấy danh sách yêu cầu xin nghỉ, vui lòng thử lại sau' });
                }
          
                const leaveRequests = results.map((request) => ({
                  id: request.requestId,
                  title: request.title,
                  startDateTime: request.startDateTime.toISOString(),
                  endDateTime: request.endDateTime.toISOString(),
                  content: request.content,
                  status: request.status,
                  userId: request.userId,
                }));
          
                res.json({ leaveRequests });
              });
            } catch (err) {
              console.error(err);
              res.status(500).json({ error: 'Lỗi: Không thể lấy danh sách yêu cầu xin nghỉ, vui lòng thử lại sau' });
            }
          }
    }

module.exports = new Request;