const { db } = require("../util/util");

const createCommunity = async (req, res) => {
  try {
    const { username } = req.user;
    const { name, description } = req.body;
    // let avatar = req.file.path;
    // avatar.replace("public", "");

    let query = `INSERT INTO community (name, description, creator, id) VALUES ($1, $2, $3, gen_random_uuid())
    RETURNING id
    `;
    let values = [name, description, username];
    let result = await db.query(query, values);
    let communityId = result.rows[0].id;
    if (result.rowCount > 0) {
      query = `
      UPDATE community
      SET admin = array_append(admin, $1),
          members = array_append(members, $1)
      WHERE id = $2;
      `;
      values = [username, communityId];
      result = await db.query(query, values);
      if (result.rowCount > 0) {
        query = `INSERT INTO rooms (communityid, name, creator, enablemessage, id) VALUES ($1, $2, $3, $4, gen_random_uuid());`;
        values = [communityId, "Announcement", username, false];
        result = await db.query(query, values);
        if (result.rowCount > 0) {
          res.status(201).json({ communityId });
        } else {
          res.status(400).json({ message: "Error creating community" });
        }
      } else {
        res.status(400).json({ message: "Error creating community" });
      }
    } else {
      res.status(400).json({ message: "Error creating community" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating community" });
  }
};

const communities = async (req, res) => {
  try {
    const { username } = req.user;

    let query = `
      SELECT * FROM community
      
      `;

    let result = await db.query(query);
    if (result.rows.length > 0) {
      let resp = result.rows;
      resp.forEach((r) => {
        if (r.members.find((m) => m == username)) {
          r.isInCommunity = true;
        }
        if (r.admin.find((m) => m == username)) {
          r.isAdmin = true;
        }
      });
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "No community as been created" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving communities" });
  }
};

const communityProfile = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { username } = req.user;

    let query = `
      SELECT * FROM community
      WHERE id = $1
      `;
    let values = [communityId];
    let result = await db.query(query, values);
    if (result.rows.length > 0) {
      let resp = result.rows;
      resp.forEach((r) => {
        if (r.members.find((m) => m == username)) {
          r.isInCommunity = true;
        }
        if (r.admin.find((m) => m == username)) {
          r.isAdmin = true;
        }
      });
      res.status(200).json(result.rows[0]);
    } else {
      res
        .status(404)
        .json({ message: "This community doesn't exsist or has been deleted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving communities" });
  }
};

const communityRooms = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { username } = req.user;

    let query = `
      SELECT * FROM rooms
      WHERE communityid = $1
      `;
    let values = [communityId];
    let result = await db.query(query, values);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "No room available yet." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving rooms" });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const { username } = req.user;
    const { communityId } = req.params;

    let query = ` 
      UPDATE community
      SET members = array_append(members, $1)
      WHERE id = $2;
      `;
    let values = [username, communityId];
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      res.json({ message: "Successfully joined community" });
    } else {
      res.status(400).json({ message: "Error joining community" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error joining community" });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const { username } = req.user;
    const { communityId } = req.params;
    let query = `
      SELECT * FROM community
      WHERE id = $1
      `;
    let values = [communityId];
    let community = await db.query(query, values);

    if (community.rows[0].creator != username) {
      query = ` 
      UPDATE community
      SET members = array_remove(members, $1)
      WHERE id = $2;
      `;
      values = [username, communityId];
      result = await db.query(query, values);
      if (result.rowCount > 0) {
        res.json({ message: "Successfully left community" });
      } else {
        res.status(400).json({ message: "Error leaving community" });
      }
    } else {
      res.status(400).json({ message: "Cannot leave your own community" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error leaving community" });
  }
};

const addAdmin = async (req, res) => {
  try {
    const { communityId, userToAdd } = req.params;
    let query = ` 
      UPDATE community
      SET admin = array_append(admin, $1)
      WHERE id = $2;
      `;
    let values = [userToAdd, communityId];
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      res.json({ message: "Successfully added admin" });
    } else {
      res.status(400).json({ message: "Error adding admin" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding admin" });
  }
};

const removeAdmin = async (req, res) => {
  try {
    const { communityId, userToRemove } = req.params;
    let query = ` 
      UPDATE community
      SET admin = array_remove(admin, $1)
      WHERE id = $2;
      `;
    let values = [userToRemove, communityId];
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      res.json({ message: "Successfully removed admin" });
    } else {
      res.status(400).json({ message: "Error removing admin" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing admin" });
  }
};

const myCommunities = async (req, res) => {
  try {
    let { username } = req.query;
    !username ? (username = req.user.username) : null;
    // const { username } = req.user;
    let query = `
      SELECT * FROM community
      WHERE creator = $1
      `;
    let values = [username];
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      let resp = result.rows;
      resp.forEach((r) => {
        if (r.members.find((m) => m == username)) {
          r.isInCommunity = true;
        }
        if (r.admin.find((m) => m == username)) {
          r.isAdmin = true;
        }
      });
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "You haven't created any community" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving communities" });
  }
};

const communityJoined = async (req, res) => {
  try {
    const { username } = req.user;
    let query = `
      SELECT * FROM community
      WHERE $1 = ANY(members)
      `;
    let values = [username];
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      let resp = result.rows;
      resp.forEach((r) => {
        if (r.members.find((m) => m == username)) {
          r.isInCommunity = true;
          r.username = username;
        }
        if (r.admin.find((m) => m == username)) {
          r.isAdmin = true;
        }
      });
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "You haven't joined any community" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving communities" });
  }
};

const communitySearch = async (req, res) => {
  try {
    let query = `
      SELECT * FROM community
      WHERE name LIKE $1
      `;
    let values = [`%${req.params.search}%`]; // search pattern
    let result = await db.query(query, values);
    if (result.rowCount > 0) {
      let resp = result.rows;
      resp.forEach((r) => {
        if (r.members.find((m) => m == username)) {
          r.isInCommunity = true;
        }
        if (r.admin.find((m) => m == username)) {
          r.isAdmin = true;
        }
      });
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "No Result Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving communities" });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const { username } = req.user;
    const { communityId } = req.params;
    let query = `
      SELECT * FROM community
      WHERE id = $1
      `;
    let values = [communityId];
    let community = await db.query(query, values);
    if (community.rows[0].creator == username) {
      query = `
      DELETE FROM community
      WHERE id = $1;
      `;
      values = [communityId];
      result = await db.query(query, values);
      query = `
      DELETE FROM rooms
      WHERE communityid = $1;
      `;
      values = [communityId];
      result = await db.query(query, values);
      query = `
      DELETE FROM message
      WHERE communityid = $1;
      `;
      values = [communityId];
      result = await db.query(query, values);
      if (result.rowCount > 0) {
        res.json({ message: "Successfully deleted community" });
      } else {
        res.status(400).json({ message: "Error deleting community" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Only community creator can delete community" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting community" });
  }
};

module.exports = {
  createCommunity,
  joinCommunity,
  leaveCommunity,
  addAdmin,
  removeAdmin,
  myCommunities,
  communityJoined,
  communities,
  communityProfile,
  communityRooms,
  communitySearch,
  deleteCommunity,
};
