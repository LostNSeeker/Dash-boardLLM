import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>Interactive Learning Assistant</h2>
        <ul>
          <li>Dashboard</li>
          <li>Study Materials</li>
          <li>LLM Comparison</li>
          <li>Progress Tracking</li>
        </ul>
      </nav>

      <div className="main-content">
        <header className="header">
          <div className="user-circle">User</div>
        </header>

        <div className="content">
          <div className="progress-overview">
            <h3>Learning Progress Overview</h3>
            <div className="overview-cards">
              <div className="card">Completed Modules</div>
              <div className="card">Quiz Performance</div>
              <div className="card">Time Spent Learning</div>
            </div>
          </div>

          <div className="llm-comparison">
            <h3>Real-Time LLM Comparison</h3>
            <div className="comparison-cards">
              <div className="card">ChatGPT</div>
              <div className="card">Claude</div>
              <div className="card">Groq</div>
            </div>
          </div>

          <div className="input-box">
            <input type="text" placeholder="Type your question here..." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
