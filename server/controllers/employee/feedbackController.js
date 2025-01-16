const { pool } = require("../../configuration/dbConfig");

class Feedback {

  //Hàm lấy tất cả feedbacks
  GetAllFeedBackFromParent(req, res) {
    // Query lấy tất cả feedback từ phụ huynh trong lớp
    const {teacherClasses} = req.body;
    const sql = `SELECT m.id, m.loai, m.noi_dung, m.created_at, m.updated_at FROM mau_nhan_xet m INNER JOIN users u ON m.creator = u.id
    INNER JOIN Role_PHHS rp ON u.id = rp.id_Ph 
    INNER JOIN enrollment_records er ON rp.id_Ph = er.id
     WHERE m.loai = 'phuhuynh_phanhoi' AND er.id_class = ?`;
    pool.query(sql, [teacherClasses], (err, results) => {
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
        const { id, loai, noi_dung, created_at } = item;
        return {
          feedbackId: id,
          title: loai,
          content: noi_dung,
          createdDate: created_at,
        };
      });

      return res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Danh sách tất cả các feedback",
        data: data,
      });
    });
  }

  //Hàm lấy feedback cụ thể
  GetDetailedFeedBackFromParent(req, res) {
    const { feedbackId } = req.params;

    // Query lấy tin nhắn bằng token
    const sql = "SELECT * FROM mau_nhan_xet WHERE loai = 'phuhuynh_phanhoi' AND id = ?";
    pool.query(sql, [feedbackId], (err, result) => {
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

      const { feedbackId, loai, noi_dung, created_at } = result[0];
      return res.status(200).json({
        status_code: 200,
        type: "success",
        data: {
          feedbackId: feedbackId,
          title: loai,
          content: noi_dung,
          createdDate: created_at,
        },
      });
    });
  }

  // // Hàm update feedback
  // UpdateFeedBack(req, res) {
  //   const { feedbackId } = req.params;
  //   const { title, content } = req.body;

  //   // Exception cho data không hợp lệ
  //   if (!content || !title ) {
  //     return res.status(400).json({
  //       status_code: 400,
  //       type: "error",
  //       message: "Vui lòng nhập đầy đủ thông tin",
  //     });
  //   }
  //   // Query update vào table messages
  //   const query = "UPDATE feedbacks SET content = ?, title = ? WHERE feedbackId = ?";
  //   pool.query(query, [content, title, feedbackId], (err, result) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).json({
  //         status_code: 500,
  //         type: "error",
  //         message: "Lỗi server",
  //       });
  //     }

  //     if (result.affectedRows === 0) {
  //       return res.status(404).json({
  //         status_code: 404,
  //         type: "error",
  //         message: "Không tìm thấy feedback cần cập nhật",
  //       });
  //     }

  //     return res.status(200).json({
  //       status_code: 200,
  //       type: "success",
  //       message: "Feedback đã được cập nhật thành công",
  //       data: {
  //           feedbackId:feedbackId,
  //           content: content,
  //           title: title,
  //       },
  //     });
  //   });
  // }

  // //Hàm xóa feedback
  // DeleteFeedBack(req, res) {
  //   const { feedbackId } = req.params;

  //   const query = "DELETE FROM feedbacks WHERE feedbackId = ?";
  //   pool.query(query, [feedbackId], (err, result) => {
  //     if (err) {
  //       console.error(err);
  //       return res
  //         .status(500)
  //         .json({ status_code: 500, type: "error", message: "Lỗi server" });
  //     }

  //     if (result.affectedRows === 0) {
  //       return res.status(404).json({
  //         status_code: 404,
  //         type: "error",
  //         message: "Feedback không tồn tại",
  //       });
  //     }

  //     return res.status(200).json({
  //       status_code: 200,
  //       type: "success",
  //       message: "Feedback đã được xóa thành công",
  //     });
  //   });
  // }
}

module.exports = new Feedback();
