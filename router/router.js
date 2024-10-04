const express = require("express");
const router = express.Router();
const { avatarUpload, authenticate } = require("../util/util");

const {
  signUp,
  logIn,
  userProfile,
  addUserAvatar,
  addOptionalData,
  deleteAccount,
  myProfile,
  changeTheme,
  changeLanguage,
} = require("../controllers/user");

const {
  createCommunity,
  editCommunity,
  communityProfile,
  joinCommunity,
  leaveCommunity,
  addAdmin,
  removeAdmin,
  myCommunities,
  communityJoined,
  communitySearch,
  deleteCommunity,
  communities,
  communityRooms,
} = require("../controllers/community");

const {
  createRoom,
  roomInfo,
  messageControl,
  deleteRoom,
} = require("../controllers/rooms");

// user routes
router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/user/profile/:username", userProfile);
router.get("/user/me", authenticate, myProfile);

router.post(
  "/user/avatar",
  authenticate,
  avatarUpload.single("avatar"),
  addUserAvatar
);
router.post("/user/changeTheme", authenticate, changeTheme);
router.post("/user/changeLanguage", authenticate, changeLanguage);
router.post("/user/optional", authenticate, addOptionalData);
router.delete("/user/delete", authenticate, deleteAccount);

// community routes
router.post("/community/create", authenticate, createCommunity);
router.post("/community/edit/:communityID", authenticate, editCommunity);
router.get("/community/all", authenticate, communities);
router.get("/community/profile/:communityId", authenticate, communityProfile);
router.get("/community/rooms/:communityId", authenticate, communityRooms);
router.post("/community/join/:communityId", authenticate, joinCommunity);
router.post("/community/leave/:communityId", authenticate, leaveCommunity);
router.post(
  "/community/addAdmin/:communityId/:userToAdd",
  authenticate,
  addAdmin
);
router.post(
  "/community/removeAdmin/:communityId/:userToRemove",
  authenticate,
  removeAdmin
);
router.get("/community/myCommunities", authenticate, myCommunities);
router.get("/community/joined", authenticate, communityJoined);
router.get("/community/search/:search", authenticate, communitySearch);
router.delete("/community/delete/:communityId", authenticate, deleteCommunity);

// room routes
router.post("/room/create/:communityId", authenticate, createRoom);
router.get("/room/info/:roomId", authenticate, roomInfo);

router.post(
  "/room/messageControl/:roomId/:controlInfo",
  authenticate,
  messageControl
);
router.delete("/room/delete/:roomId", authenticate, deleteRoom);

module.exports = router;
