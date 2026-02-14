const express = require("express");
const router = express.Router();

const {
  sentRequest,
  getIncomingRequests,
  acceptRequest,
  getMyConnections,
  getAllUsersFiltered
} = require("../controllers/connection");

// send request
router.post("/send/:senderId/:receiverId", sentRequest);

// incoming pending requests
router.get("/incoming/:userId", getIncomingRequests);

// accept request
router.post("/accept/:receiverId/:senderId", acceptRequest);

// accepted connections
router.get("/connections/:userId", getMyConnections);

// filtered users
router.get("/users/:userId", getAllUsersFiltered);

module.exports = router;
