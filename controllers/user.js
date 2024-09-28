const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { db } = require("../util/util");

const signUp = async (req, res) => {
  try {
    console.log(req.body);
    let { username, email, password, firstname, lastname } = req.body;
    username = "@" + username;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, email, password, firstname, lastname, theme, id) VALUES ($1, $2, $3, $4, $5, $6, gen_random_uuid())`;
    const values = [
      username,
      email,
      hashedPassword,
      firstname,
      lastname,
      "system",
    ];
    const result = await db.query(query, values);

    if (result.rowCount > 0) {
      res.status(201).json({ message: "User created successfully!" });
    } else {
      res.status(400).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const logIn = async (req, res) => {
  try {
    let { userId, password } = req.body;
    // checking if the user inputted email using regex
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(userId)) {
      userId = "@" + userId;
      //  adding @ to the inputted data if its not an email
    }
    const query = `SELECT * FROM users WHERE username = $1 OR email = $1;`;
    const values = [userId];
    const result = await db.query(query, values);
    let user = result.rows[0];
    if (result.rows.length > 0) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

const userProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const query = `SELECT * FROM users WHERE username = $1;`;
    const values = [username];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};

const myProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const query = `SELECT * FROM users WHERE id = $1;`;
    const values = [userId];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};

const addUserAvatar = async (req, res) => {
  try {
    const { userId } = req.user;

    let avatar = req.file.path;
    avatar = avatar.replace("public", "");
    const query = `UPDATE users SET avatar = $1 WHERE id = $2;`;
    const values = [avatar, userId];
    const result = await db.query(query, values);
    if (result.rowCount > 0) {
      res.json({ message: "Avatar added successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding avatar" });
  }
};

const changeTheme = async (req, res) => {
  try {
    const { userId } = req.user;
    let { theme } = req.body;

    let query = `UPDATE users SET theme = $1 WHERE id = $2;`;
    let values = [theme, userId];

    const result = await db.query(query, values);
    if (result.rowCount > 0) {
      res.json({ message: "Theme saved" });
    } else {
      res.status(404).json({ message: "Error saving theme" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving theme" });
  }
};

const addOptionalData = async (req, res) => {
  try {
    const { userId } = req.user;
    let { dob, bio } = req.body;
    let query;
    let values;
    if (dob && !bio) {
      // check if the user has provided a date of birth but not a bio
      query = `UPDATE users SET dob = $1 WHERE id = $2;`;
      values = [dob, userId];
    } else if (!dob && bio) {
      // check if the user has provided a bio but not a date of birth
      query = `UPDATE users SET bio = $1 WHERE id = $2;`;
      values = [bio, userId];
    } else {
      // check if the user has provided both a date of birth and a bio
      query = `UPDATE users SET dob = $1, bio = $2 WHERE id = $3;`;
      values = [dob, bio, userId];
    }

    const result = await db.query(query, values);
    if (result.rowCount > 0) {
      res.json({ message: "Successfully uplaoded" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.user;
    const query = `DELETE FROM users WHERE id = $1;`;
    const values = [userId];
    const result = await db.query(query, values);
    let communityId = await db.query(
      `
    DELETE FROM communites 
    WHERE creator = $1
    RETURNING id
    `,
      userId
    );

    await db.query(
      `
    DELETE FROM rooms 
    WHERE communityid = $1
    RETURNING id
    `,
      communityId.rows[0].id
    );

    await db.query(
      `
    DELETE FROM message 
    WHERE communityid = $1
    RETURNING id
    `,
      communityId.rows[0].id
    );

    if (result.rowCount > 0) {
      res.json({ message: "Account deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting account" });
  }
};

module.exports = {
  signUp,
  logIn,
  userProfile,
  myProfile,
  addUserAvatar,
  changeTheme,
  addOptionalData,
  deleteAccount,
};
