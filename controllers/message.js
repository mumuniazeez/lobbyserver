const { db } = require("../util/util");

const sendMessage = async (messageInfo) => {
  try {
    const { username, communityId, roomId, message } = messageInfo;

    let query = `INSERT INTO message (creator, communityid, roomid, message, id) VALUES ($1, $2, $3, $4, gen_random_uuid())
    RETURNING *;
    `;
    let values = [username, communityId, roomId, message];
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
    WHERE roomId = $1
    `;
    let values = [roomId];
    let result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
