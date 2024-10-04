const { db } = require("../util/util");

const sendMessage = async (messageInfo) => {
  try {
    const { username, communityId, roomId, message } = messageInfo;

    let query = `INSERT INTO message (creator, communityid, roomid, message, type, id) VALUES ($1, $2, $3, $4, $5, gen_random_uuid())
    RETURNING *;
    `;
    let values = [username, communityId, roomId, message, "normal"];
    let result = await db.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error(error);
  }
};

const getMessages = async (messageInfo) => {
  try {
    const { username, communityId, roomId } = messageInfo;

    let query = `SELECT * FROM message 
    WHERE roomId = $1 and communityId = $2 
    ORDER BY createdat ASC
    `;
    let values = [roomId, communityId];
    let result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error(error);
  }
};

const editMessage = async (messageInfo) => {
  const { message, id, roomId } = messageInfo;

  try {
    let query = `UPDATE message SET message = $1, type = $2 WHERE id = $3`;
    let values = [message, "edited", id];
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      query = `SELECT * FROM message 
      WHERE roomId = $1
      ORDER BY createdat ASC
      `;
      values = [roomzId];
      result = await db.query(query);
      return result.rows;
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteMessage = async (messageInfo) => {
  const { id, roomId } = messageInfo;
  try {
    let query = `UPDATE message SET message = $1, type = $2 WHERE id = $3`;
    let values = ["This message is deleted", "deleted", id];
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      query = `SELECT * FROM message 
      WHERE roomId = $1
      ORDER BY createdat ASC
      `;
      values = [roomId];
      result = await db.query(query, values);

      return result.rows;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
};
