
const {pool} = require('../../configuration/dbConfig')

class Contact{
    GetAllContacts(req,res){
    const sql = 'SELECT * FROM nhan_vien';
    pool.query(sql, (err, results) => {
        if (err) {
        console.error(err);
        return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
        }

        const contacts = results.map(contact => ({
        avatar: contact.hinh_anh,
        phoneNumber: contact.dien_thoai,
        name: contact.ho + ' ' + contact.ten,
        category: contact.chuc_vu
        }));

        res.status(200).json({status_code: 200, type:"success", message: "Thông tin liên lạc", data: contacts });
    });
    }
}
module.exports = new Contact;
