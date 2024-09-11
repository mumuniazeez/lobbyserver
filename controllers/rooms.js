const { db } = require("../util/util");

const createRoom = async (req, res) => {
  try {
    const { username } = req.user;
    const { communityId } = req.params;
    const { name, enableMessage } = req.body;
    const query = `INSERT INTO rooms (communityid, name, enablemessage, creator, id) VALUES ($1, $2, $3, $4, gen_random_uuid())
    RETURNING id;`;
    const values = [communityId, name, enableMessage, username];
    const result = await db.query(query, values);
    let roomId = result.rows[0].id;
    if (result.rowCount > 0) {
      res.json({ communityId, roomId });
    } else {
      res.status(400).json({ message: "Error creating room" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating room" });
  }
};

const roomInfo = async (req, res) => {
  try {
    const { username } = req.user;
    const { roomId } = req.params;
    const query = `SELECT * FROM rooms WHERE id=$1`;
    const values = [roomId];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      result.rows[0].username = username;
      res.json(result.rows[0]);
    } else {
      res.status(400).json({ message: "Error retrieving room" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving room" });
  }
};

const messageControl = async (req, res) => {
  // change room settings to allow messages

  try {
    const { roomId, controlInfo } = req.params;
    const query = `UPDATE rooms SET enablemessage = $1 WHERE id = $2;`;
    const values = [controlInfo, roomId];
    const result = await db.query(query, values);
    if (result.rowCount > 0) {
      res.json({ message: "Message control successfully changed" });
    } else {
      res.status(400).json({ message: "Error changing message control" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    let query = `DELETE FROM rooms WHERE id = $1;`;
    let values = [roomId];
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      query = `DELETE FROM message WHERE roomid = $1;`;
      values = [roomId];
      result = await db.query(query, values);
      if (result.rowCount > 0) {
        res.json({ message: "Room deleted successfully" });
      }
    } else {
      res.status(400).json({ message: "Error deleting room" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting room" });
  }
};

module.exports = { createRoom, roomInfo, messageControl, deleteRoom };
