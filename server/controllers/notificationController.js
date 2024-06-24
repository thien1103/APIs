const {connection} = require('../configuration/dbConfig')
const moment = require('moment');

class Notification {
  GetAllNotifications(req, res) {
    const query = 'SELECT * FROM notifications';
    connection.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
      }

      const notifications = results.map((notification) => ({
        title: notification.title,
        content: notification.content,
        dateTime: moment(notification.created_at).toISOString(),
        images: notification.images,
      }));
      res.status(200).json({status_code: 200, type:"success", message: notifications });
    });
  }
}

module.exports = new Notification();