const {connection} = require('../configuration/dbConfig')

class HealthPost{
    //Hàm controller để lấy danh sách các bài đăng về sức khỏe
    GetAllHealthPost(req, res){
    connection.query('SELECT * FROM healthPost', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu ' });
        }
    
        const posts = results.map(post => ({
          postId: post.postId,
          title: post.title,
          content: post.content,
          image: post.image
        }));
    
        res.json({ posts });
      });
    }

    //Hàm lấy thông tin chi tiết từng post
    GetDetailedPost(req, res){
    const postId = req.params.postId;
    const query = 'SELECT * FROM healthPost WHERE postId = ?';
    connection.query(query, [postId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
         }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
         }

    const post = result[0];
    res.json({
      postId: post.postId,
      title: post.title,
      content: post.content,
      image: post.image
        });
    });
    }
}

module.exports = new HealthPost;