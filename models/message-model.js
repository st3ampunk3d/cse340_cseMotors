const pool = require("../database/")

async function getInboxMessages(account_id) {
    const sql = "SELECT message_id, message_subject, message_from, message_read, to_char(message_created, 'Mon DD') AS message_date FROM messages WHERE message_to = $1 AND message_archived = FALSE";
    const data = await pool.query(sql, [account_id]);
    return data.rows
}

async function getSentMessages(account_id) {
    const sql = "SELECT message_id, message_subject, message_to, message_read, to_char(message_created, 'Mon DD') AS message_date FROM messages WHERE message_from = $1 AND message_archived = FALSE";
    const data = await pool.query(sql, [account_id]);
    return data.rows
}

async function getArchived(account_id) {
    const sql = "SELECT message_id, message_subject, message_from, message_read, to_char(message_created, 'Mon DD') AS message_date FROM messages WHERE message_to = $1 AND message_archived = TRUE";
    const data = await pool.query(sql, [account_id]);
    return data.rows
}

async function sendMessage (message_subject, message_body, message_to, message_from) {

        const sql = "INSERT INTO messages (message_subject, message_body, message_to, message_from) VALUES ($1, $2, $3, $4) RETURNING *"
        return await pool.query(sql, [message_subject, message_body, message_to, message_from])

}

async function archiveMessage (message_id) {
    try {
        const sql = "UPDATE messages SET message_archived=TRUE WHERE message_id=$1 RETURNING *"
        const data = await pool.query(sql, [message_id])
        return data.rows[0]
    } catch (error) {
        return error.message
    }
}

async function deleteMessage(message_id) {
      const sql = "DELETE from messages WHERE message_id=$1 RETURNING *"
      const data = await pool.query(sql, [message_id])
      console.log(data.rows)
      return data.rows[0]
  }

async function markRead (message_id, message_read) {
        const sql = "UPDATE messages SET message_read=$1 WHERE message_id=$2 RETURNING *"
        const data = await pool.query(sql, [message_read, message_id])
        return data.rows[0]
}

async function getMessageById (message_id) {
    try {
        const sql = "SELECT * FROM messages WHERE message_id=$1"
        const data = await pool.query(sql, [message_id])
        return data.rows[0]
    }catch (error) {
        return error.message
    }    
} 


module.exports = {
    getInboxMessages,
    getSentMessages,
    getArchived,
    sendMessage,
    archiveMessage,
    deleteMessage,
    getMessageById,
    markRead
}