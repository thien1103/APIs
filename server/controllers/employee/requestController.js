const { pool } = require("../../configuration/dbConfig");
const moment = require("moment");

class Request {
  
  //Hàm lấy tất cả xin nghỉ theo lớp cho giáo viên
  GetAllLeaveRequestsOnClassForTeacher(req, res) {
    try {
      const { teacherClasses } = req.body; // Assuming teacherClasses is passed in the request body
      
      // Validate and sanitize input
      const sanitizedClasses = teacherClasses 
        ? teacherClasses.map(Number).filter(Boolean)
        : [];
        
      if (sanitizedClasses.length === 0) {
        return res.status(400).json({
          status_code: 400,
          type: "error",
          message: "Danh sách lớp học không hợp lệ"
        });
      }

      // Create safe parameterized query
      const placeholders = sanitizedClasses.map(() => '?').join(',');

      const sql = `
        SELECT 
          l.id, 
          l.user_id, 
          l.title, 
          l.content, 
          l.status, 
          l.startDateTime, 
          l.endDateTime, 
          dr.date, 
          dr.morningSession, 
          dr.afternoonSession, 
          u.name AS parent_name, 
          er.name AS student_name 
        FROM \`leave\` l 
        INNER JOIN date_ranges_request dr ON l.id = dr.requestId 
        INNER JOIN users u ON l.user_id = u.id 
        INNER JOIN Role_PHHS rp ON u.id = rp.id_ph 
        INNER JOIN enrollment_records er ON rp.id_hs = er.id 
        WHERE er.id_class IN (${placeholders})
      `;
  
      pool.query(sql, sanitizedClasses, (err, results) => {
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
            message: "Chưa có yêu cầu xin nghỉ nào",
          });
        }
  
        // Formatting JSON response
        const leaveRequests = results.map(row => {
          const {
            id,
            user_id,
            title,
            content,
            status,
            startDateTime,
            endDateTime,
            date,
            morningSession,
            afternoonSession,
            parent_name,
            student_name
          } = row;
  
          // Format boolean to text for status
          const statusText = status === 1 ? "Đã duyệt" : "Chưa duyệt";
  
          return {
            id,
            user_id,
            title,
            content,
            status: statusText,
            dateRangeList: [
              {
                date,
                session: {
                  morning: morningSession === 1,
                  afternoon: afternoonSession === 1,
                },
              },
            ],
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            parent_name,
            student_name,
          };
        });
  
        res.status(200).json({
          status_code: 200,
          type: "success",
          message: "Danh sách tất cả các yêu cầu xin nghỉ",
          data: leaveRequests,
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status_code: 500, type: "error", message: "Lỗi server" });
    }
  }


  //Hàm lấy xin nghỉ chi tiết cho giáo viên
  GetDetailedLeaveRequest(req, res) {
    const { requestId } = req.params; // Use remindId as the parameter
  
    // Query to get the remind medicines
    const sql = `
      SELECT 
        r.id, 
        r.content, 
        r.title,
        r.startDateTime, 
        r.endDateTime, 
        r.status,
        dr.date, 
        dr.morningSession, 
        dr.afternoonSession,
        u.name AS parent_name,
        er.name AS student_name
      FROM \`leave\` r
      LEFT JOIN date_ranges_request dr ON r.id = dr.requestId
      INNER JOIN users u ON r.user_id = u.id
      INNER JOIN Role_PHHS rp ON u.id = rp.id_ph
      INNER JOIN enrollment_records er ON rp.id_hs = er.id
      WHERE r.id = ?
    `;
  
    pool.query(sql, [requestId], (err, result) => {
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
          message: "Lời nhắc không tồn tại",
        });
      }
  
      // Format the response
      const {
        id,
        content,
        title,
        startDate,
        endDate,
        status,
        date,
        morningSession,
        afternoonSession,
        parent_name,
        student_name
      } = result[0]; // Use first result since the id is unique
  
      // Format boolean to text for status
      const statusText = status === 1 ? "Xác nhận" : "Chưa xác nhận";
  
      const response = {
        id,
        content,
        title,
        dateRangeList: [
          {
            date,
            session: {
              morning: morningSession === 1,
              afternoon: afternoonSession === 1,
            },
          },
        ],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: statusText,
        parent_name,
        student_name,
      };
  
      res.status(200).json({
        status_code: 200,
        type: "success",
        message: "Chi tiết xin nghỉ",
        data: response,
      });
    });
  }

}

module.exports = new Request();
