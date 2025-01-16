
const {pool} = require('../../configuration/dbConfig')

class Contact{
    GetAllContacts(req, res) {
        const { enrollmentIds } = req.body; // Assuming the list is sent in the request body.
    
        if (!Array.isArray(enrollmentIds) || enrollmentIds.length === 0) {
            return res.status(400).json({
                status_code: 400,
                type: "error",
                message: "Invalid or empty enrollmentIds provided",
            });
        }
    
        const placeholders = enrollmentIds.map(() => '?').join(','); // Create placeholders for the SQL query.
    
        const sql = `
            SELECT 
                er.id AS enrollment_id,
                er.image, 
                er.parent_phone, 
                er.parent_name, 
                er.mother_phone, 
                er.mother_name, 
                er.name 
            FROM enrollment_records AS er
            WHERE er.id IN (${placeholders})
        `;
    
        pool.query(sql, enrollmentIds, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status_code: 500,
                    type: "error",
                    message: "Server error",
                });
            }
    
            const contacts = results.map(contact => ({
                enrollmentId: contact.enrollment_id,
                avatar: contact.image,
                phoneNumber: contact.parent_phone || contact.mother_phone, // Default to parent_phone, fallback to mother_phone
                name_ph: contact.parent_name || contact.mother_name,      // Default to parent_name, fallback to mother_name
                name_hs: contact.name,
            }));
    
            res.status(200).json({
                status_code: 200,
                type: "success",
                message: "Filtered enrollment records",
                data: contacts,
            });
        });
    }
    
    
}
module.exports = new Contact;
