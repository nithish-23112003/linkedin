import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { name: "home", label: "Home", href: "/" },
    { name: "mypost", label: "myPost", href: "/mypost" },
    { name: "createpost", label: "createPost", href: "/post/create" },
    { name: "users", label: "users", href: "/users" },
    { name: "account", label: "account", href: "/profile" },
    { name: "logout", label: "logout", href: "/logout" },
  ];

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {navItems.map(({ name, label, href }) => (
          <li key={name} className="navbar-item">
            <NavLink
              to={href}
              end={href === "/"} /* ensures exact match for root */
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setActive(name)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
