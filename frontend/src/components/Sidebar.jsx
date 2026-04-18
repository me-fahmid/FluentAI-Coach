import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiMessageCircle, FiVolume2, FiEdit3, FiAward, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ open, onToggle, onLogout, user }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/daily-plan', icon: <FiBook />, label: 'Daily Plan' },
    { path: '/chat', icon: <FiMessageCircle />, label: 'Chat' },
    { path: '/roleplay', icon: <FiVolume2 />, label: 'Roleplay' },
    { path: '/writing', icon: <FiEdit3 />, label: 'Writing' },
    { path: '/vocabulary', icon: <FiAward />, label: 'Vocabulary' },
    { path: '/prompts', icon: <FiSettings />, label: 'Prompts' }
  ];

  return (
    <>
      <div className="mobile-header">
        <h1>FluentAI</h1>
        <button className="menu-toggle" onClick={onToggle}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1>FluentAI Coach</h1>
          <p className="user-info">{user?.name}</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth < 768) onToggle();
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;