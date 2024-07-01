const { connection } = require("../configuration/dbConfig");

class Message {
  // Hàm tạo và gửi tin nhắn
  SendMessage(req, res) {
    const { content, status } = req.body;

    // Exception cho data không hợp lệ
    if (!content || status === undefined) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const created = new Date();

    // If để phân loại status trả về
    let statusValue;
    if (status === "Chưa xác nhận") {
      statusValue = 0;
    } else if (status === "Xác nhận") {
      statusValue = 1;
    } else {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Giá trị status trả về không hợp lệ",
      });
    }

    // Query insert vào table requests
    const query =
      "INSERT INTO messages (content, createdDate, status) VALUES (?, ?, ?)";
    connection.query(
      query,
      [content, created, statusValue],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server",
          });
        }
        return res.status(200).json({
          status_code: 200,
          type: "success",
          message: "Tin nhắn đã được gửi thành công",
          data: {
            content: content,
            createdDate: created,
            status: status,
          },
        });
      }
    );
  }

  //Hàm lấy tất cả tin nhắn
  GetAllMessage(req, res) {
    // Query lấy tất cả tin nhắn
    const query = "SELECT * FROM messages";
    connection.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Lỗi server",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Chưa có tin nhắn nào",
        });
      }

      // Tạo một mảng mới để lưu trữ data
      const messages = results.map((item) => {
        const { messageId, content, createdDate, status } = item;
        let statusText;
        if (status === 1) {
          statusText = "Xác nhận";
        } else {
          statusText = "Chưa xác nhận";
        }

        return {
          messageId,
          content,
          createdDate,
          status: statusText,
        };
      });

      return res.status(200).json({
        status_code: 200,
        type: "success",
        data: messages,
      });
    });
  }

  //Hàm lấy tin nhắn cụ thể
  GetDetailedMessage(req, res) {
    const { messageId } = req.params;

    // Query lấy tin nhắn bằng token
    const query = "SELECT * FROM messages WHERE messageId = ?";
    connection.query(query, [messageId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status_code: 500,
          type: "error",
          message: "Lỗi server",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Không tìm thấy tin nhắn",
        });
      }

      const { messageId, content, createdDate, status } = result[0];
      let statusText;
      if (status === 1) {
        statusText = "Xác nhận";
      } else {
        statusText = "Chưa xác nhận";
      }

      return res.status(200).json({
        status_code: 200,
        type: "success",
        data: {
          messageId: messageId,
          content: content,
          createdDate: createdDate,
          status: statusText,
        },
      });
    });
  }

  // Hàm update tin nhắn
  UpdateMessage(req, res) {
    const { messageId } = req.params;
    const {  content, status } = req.body;

    // Exception cho data không hợp lệ
    if ( !content || status === undefined) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    // If để phân loại status trả về
    let statusValue;
    if (status === "Chưa xác nhận") {
      statusValue = 0;
    } else if (status === "Xác nhận") {
      statusValue = 1;
    } else {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Giá trị status trả về không hợp lệ",
      });
    }

    // Query update vào table messages
    const query =
      "UPDATE messages SET content = ?, status = ? WHERE messageId = ?";
    connection.query(
      query,
      [content, statusValue, messageId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status_code: 500,
            type: "error",
            message: "Lỗi server",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status_code: 404,
            type: "error",
            message: "Không tìm thấy tin nhắn cần cập nhật",
          });
        }

        return res.status(200).json({
          status_code: 200,
          type: "success",
          message: "Tin nhắn đã được cập nhật thành công",
          data: {
            messageId: messageId,
            content: content,
            status: status,
          },
        });
      }
    );
  }

  //Hàm xóa tin nhắn
  DeleteMessage(req, res) {
    const { messageId } = req.params;

    const query = "DELETE FROM messages WHERE messageId = ?";
    connection.query(query, [messageId], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Tin nhắn không tồn tại",
        });
      }

      return res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Tin nhắn được xóa thành công",
      });
    });
  }
}

module.exports = new Message();
