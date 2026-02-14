const User = require("../models/user");
const Connection = require("../models/connection");

/* ================= SEND REQUEST ================= */
const sentRequest = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    // prevent duplicate or reverse duplicate
    const exists = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Connection already exists or pending" });
    }

    await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending"
    });

    res.status(201).json({ message: "Request sent" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ================= INCOMING REQUESTS (PENDING ONLY) ================= */
const getIncomingRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await Connection.find({
      receiver: userId,
      status: "pending"
    }).populate("sender", "username");

    res.json(requests);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ================= ACCEPT REQUEST ================= */
const acceptRequest = async (req, res) => {
  const { receiverId, senderId } = req.params;

  try {
    const connection = await Connection.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending"
    });

    if (!connection) {
      return res.status(404).json({ message: "Request not found" });
    }

    connection.status = "accepted";
    await connection.save();

    res.json({ message: "Connection accepted", connection });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ================= MY CONNECTIONS (ACCEPTED ONLY) ================= */
const getMyConnections = async (req, res) => {
  const { userId } = req.params;

  try {
    const connections = await Connection.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate("sender", "username")
      .populate("receiver", "username");

    res.json(connections);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ================= FILTERED USERS ================= */
const getAllUsersFiltered = async (req, res) => {
  const { userId } = req.params;

  try {
    // find all connections involving user
    const connections = await Connection.find({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    const excludedIds = connections.map(c =>
      c.sender.toString() === userId ? c.receiver : c.sender
    );

    const users = await User.find({
      _id: { $ne: userId, $nin: excludedIds }
    });

    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  sentRequest,
  getIncomingRequests,
  acceptRequest,
  getMyConnections,
  getAllUsersFiltered
};
