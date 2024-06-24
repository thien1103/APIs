const { connection } = require('../configuration/dbConfig');
const verifyToken = require('../middleware/verifyToken');

class HealthPost {
  GetAllHealthPost(req, res) {
    connection.query('SELECT * FROM healthPost', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
      }

      const posts = results.map(post => ({
        postId: post.postId,
        title: post.title,
        content: post.content,
        image: post.image,
      }));

      res.status(200).json({status_code: 200, type:"success", message: posts});
    });
  }

  GetDetailedPost(req, res) {
    const postId = req.params.postId;
    const query = 'SELECT * FROM healthPost WHERE postId = ?';
    connection.query(query, [postId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
      }

      if (result.length === 0) {
        return res.status(404).json({status_code: 404, type:"error", message:"Bài đăng không tồn tại"});
      }

      const post = result[0];
      res.json({
        status_code: 200, type:"success", message:{ postId: post.postId, title: post.title, content: post.content, image: post.image,}
      });
    });
  }
}

module.exports = new HealthPost;