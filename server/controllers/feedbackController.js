const { connection } = require("../configuration/dbConfig");

class Feedback {
  // Hàm tạo feedback
  CreateFeedBack(req, res) {
    const { title, content } = req.body;

    // Exception cho data không hợp lệ
    if (!content || !title) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const createdDate = new Date();

    // Query insert vào table requests
    const query =
      "INSERT INTO feedbacks (title, content, createdDate) VALUES (?, ?, ?)";
    connection.query(
      query,
      [title, content, createdDate],
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
            title: title,
            content: content,
            createdDate: createdDate,
          },
        });
      }
    );
  }

  //Hàm lấy tất cả feedbacks
  GetAllFeedBack(req, res) {
    // Query lấy tất cả feedback
    const query = "SELECT * FROM feedbacks";
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
          message: "Chưa có feedback nào",
        });
      }

      // Tạo một mảng mới để lưu trữ data
      const data = results.map((item) => {
        const { feedbackId, title, content, createdDate} = item;
        return {
          feedbackId,
          title,
          content,
          createdDate,
        };
      });

      return res.status(200).json({
        status_code: 200,
        type: "success",
        message:"Danh sách tất cả các feedback",
        data: data,
      });
    });
  }

  //Hàm lấy feedback cụ thể
  GetDetailedFeedBack(req, res) {
    const { feedbackId } = req.params;

    // Query lấy tin nhắn bằng token
    const query = "SELECT * FROM feedbacks WHERE feedbackId = ?";
    connection.query(query, [feedbackId], (err, result) => {
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
          message: "Không tìm thấy feedback tương ứng",
        });
      }

      const { feedbackId, title, content, createdDate} = result[0];
      return res.status(200).json({
        status_code: 200,
        type: "success",
        data: {
          feedbackId: feedbackId,
          title: title,
          content: content,
          createdDate: createdDate,
        },
      });
    });
  }

  // Hàm update feedback
  UpdateFeedBack(req, res) {
    const { feedbackId } = req.params;
    const { title, content } = req.body;

    // Exception cho data không hợp lệ
    if (!content || !title ) {
      return res.status(400).json({
        status_code: 400,
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    // Query update vào table messages
    const query = "UPDATE feedbacks SET content = ?, title = ? WHERE feedbackId = ?";
    connection.query(query, [content, title, feedbackId], (err, result) => {
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
          message: "Không tìm thấy feedback cần cập nhật",
        });
      }

      return res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Feedback đã được cập nhật thành công",
        data: {
            feedbackId:feedbackId,
            content: content,
            title: title,
        },
      });
    });
  }

  //Hàm xóa feedback
  DeleteFeedBack(req, res) {
    const { feedbackId } = req.params;

    const query = "DELETE FROM feedbacks WHERE feedbackId = ?";
    connection.query(query, [feedbackId], (err, result) => {
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
          message: "Feedback không tồn tại",
        });
      }

      return res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Feedback đã được xóa thành công",
      });
    });
  }
}

module.exports = new Feedback();
