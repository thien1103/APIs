const { connection } = require('../configuration/dbConfig');
const verifyToken = require('../middleware/verifyToken');
const path = require('path');

class HealthPost {
  GetAllHealthPost(req, res) {
    connection.query("SELECT * FROM healthPost", (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      const posts = results.map((post) => ({
        postId: post.postId,
        title: post.title,
        content: post.content,
        image: post.image,
      }));

      res
        .status(200)
        .json({
          status_code: 200,
          type: "success",
          message: "Tất cả bài viết",
          data: posts,
        });
    });
  }

  GetDetailedPost(req, res) {
    const postId = req.params.postId;
    const query = "SELECT * FROM healthPost WHERE postId = ?";
    connection.query(query, [postId], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({
            status_code: 404,
            type: "error",
            message: "Bài đăng không tồn tại",
          });
      }

      const post = result[0];
      res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Bài đăng chi tiết",
        data: {
          postId: post.postId,
          title: post.title,
          content: post.content,
          image: post.image,
        },
      });
    });
  }

  //Hàm lấy HealthPost Image để gửi lên client
  GetHealthPostImage(req, res) {
    const { filename } = req.params;
    const imagePath = path.resolve(
      __dirname,
      "..",
      "public",
      "image",
      filename
    );

    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(404).json({
          status_code: 404,
          type: "error",
          message: "Ảnh không tồn tại",
        });
      }
    });
  }
}

module.exports = new HealthPost;