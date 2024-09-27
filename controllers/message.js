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
    `;
    let values = [roomId, communityId];
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
