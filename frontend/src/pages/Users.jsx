import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./Users.css";

export default function Connections() {
  const userId = localStorage.getItem("userId");

  const [users, setUsers] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    loadAll();
  }, [userId]);

  const loadAll = () => {
    fetchUsers();
    fetchIncoming();
    fetchConnections();
  };

  /* ================= USERS ================= */
  const fetchUsers = async () => {
    const res = await axios.get(
      `http://localhost:8080/users/${userId}`
    );
    setUsers(res.data);
  };

  /* ================= INCOMING ================= */
  const fetchIncoming = async () => {
    const res = await axios.get(
      `http://localhost:8080/incoming/${userId}`
    );
    setIncoming(res.data);
  };

  /* ================= CONNECTIONS ================= */
  const fetchConnections = async () => {
    const res = await axios.get(
      `http://localhost:8080/connections/${userId}`
    );
    setConnections(res.data);
  };

  /* ================= SEND REQUEST ================= */
  const sendRequest = async (receiverId) => {
    await axios.post(
      `http://localhost:8080/send/${userId}/${receiverId}`
    );
    fetchUsers();
  };

  /* ================= ACCEPT REQUEST ================= */
  const acceptRequest = async (senderId) => {
    await axios.post(
      `http://localhost:8080/accept/${userId}/${senderId}`
    );
    loadAll();
  };

  /* ================= IMAGE FALLBACK ================= */
  const avatar = (img) =>
    img
      ? `http://localhost:8080/${img}`
      : "https://via.placeholder.com/50";

  return (
    <>
      <Navbar />
      <div className="users-container">
        <h2>Connections</h2>

        {/* ===== MY CONNECTIONS ===== */}
        <div className="section">
          <h3>My Connections</h3>

          {connections.length === 0 ? (
            <p>No connections</p>
          ) : (
            connections.map(c => {
              const user =
                c.sender._id === userId ? c.receiver : c.sender;

              return (
                <div className="user-card" key={c._id}>
                  <img
                    src={avatar(user.profilePic)}
                    alt="profile"
                    className="user-avatar"
                  />
                  <Link to={`/profile/${user._id}`}>
                    @{user.username}
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* ===== AVAILABLE USERS ===== */}
        <div className="section">
          <h3>Available Users</h3>

          {users.map(u => (
            <div className="user-card" key={u._id}>
              <img
                src={avatar(u.profilePic)}
                alt="profile"
                className="user-avatar"
              />
              <Link to={`/profile/${u._id}`}>
                @{u.username}
              </Link>
              <button onClick={() => sendRequest(u._id)}>
                Send Request
              </button>
            </div>
          ))}
        </div>

        {/* ===== INCOMING REQUESTS ===== */}
        <div className="section">
          <h3>Incoming Requests</h3>

          {incoming.length === 0 ? (
            <p>No incoming requests</p>
          ) : (
            incoming.map(r => (
              <div className="user-card" key={r._id}>
                <img
                  src={avatar(r.sender.profilePic)}
                  alt="profile"
                  className="user-avatar"
                />
                <span>@{r.sender.username}</span>
                <button
                  onClick={() => acceptRequest(r.sender._id)}
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
