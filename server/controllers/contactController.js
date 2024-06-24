
const {connection} = require('../configuration/dbConfig')

class Contact{
    GetAllContacts(req,res){
    const query = 'SELECT * FROM contact';
    connection.query(query, (err, results) => {
        if (err) {
        console.error(err);
        return res.status(500).json({status_code: 500, type:"error", message:"Lỗi server"});
        }

        const contacts = results.map(contact => ({
        avatar: contact.avatar,
        phoneNumber: contact.phoneNumber,
        name: contact.name,
        category: contact.category
        }));

        res.status(200).json({status_code: 200, type:"success", message: contacts });
    });
    }
}
module.exports = new Contact;
