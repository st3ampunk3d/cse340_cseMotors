const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update account information (name and email)
* *************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email){
  try {
    const sql = "UPDATE account SET account_firstname=$1, account_lastname=$2, account_email=$3 WHERE account_id=$4 RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update password
* *************************** */
async function changePassword(account_id, new_password) {
  try {
    const sql = "UPDATE account SET account_password=$1 WHERE account_id=$2 RETURNING *"
    return await pool.query(sql, [new_password, account_id])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("Account could not be found")
  }
}

async function getIdByName (name) {
    let [account_firstname, account_lastname] = name.split(" ")
  try {
    const result = await pool.query(
      'SELECT account_id FROM account WHERE account_firstname=$1 AND account_lastname=$2',
      [account_firstname, account_lastname])
    return result.rows[0].account_id
  } catch (error) {
    return new Error("Account could not be found")
  }
}

async function getNameById (account_id) {
    console.log(account_id)
    const result = await pool.query(
      'SELECT * FROM account WHERE account_id=$1',
      [account_id])
    return `${result.rows[0].account_firstname} ${result.rows[0].account_lastname}`
}

async function getAllUsers (account_id) {
  return await pool.query(`SELECT account_id, account_email FROM account WHERE account_id!=$1`, [account_id])
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  getNameById,
  updateAccount,
  changePassword,
  getIdByName,
  getAllUsers
}