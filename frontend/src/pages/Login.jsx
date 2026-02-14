import { useState } from "react";
import { useAuth } from "../assets/authContext";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const success = await login(username, password);

      if (success) {
        navigate("/");
      }
    } catch (e) {
      console.error("Login error:", e.message);
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="card p-4 shadow" style={{ width: "380px" }}>
          
          <div className="text-center mb-3">
            <i className="bi bi-linkedin" style={{ fontSize: "40px", color: "#0a66c2" }}></i>
          </div>

          <h3 className="text-center mb-3">Login</h3>

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label>Email address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <small className="form-text text-muted">
                We'll never share your username with anyone else.
              </small>
            </div>

            <div className="form-group mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <p className="mt-2">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>

            <button type="submit" className="btn btn-primary w-100 mt-2">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
