const {pool} = require('../configuration/dbConfig')
const moment = require('moment');

class Notification {
  GetAllNotifications(req, res) {

    pool.query("SELECT * FROM tin_tuc_su_kiens", (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ status_code: 500, type: "error", message: "Lỗi server" });
      }

      const notifications = results.map((notification) => ({
        title: notification.tieude,
        content: notification.noidung,
        dateTime: moment(notification.thoigian).toISOString(),
        images: notification.image,
      }));
      res
        .status(200)
        .json({
          status_code: 200,
          type: "success",
          message: "Tất cả thông báo",
          data: notifications,
        });
    });
  }
}



module.exports = new Notification();