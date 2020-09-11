import React from "react";
import { Link } from "react-router-dom";

import "./dashboard.css";

function Dashboard(props) {
  const teacherName = props.teacher;

  return (
    <div>
      <p className="teacher-name">{teacherName}</p>
      <ul>
        <Link className="button-link" to="/students">
          <li className="scroll-box-button">Students</li>
        </Link>
        <Link className="button-link" to="/calendar">
          <li className="scroll-box-button">Calendar</li>
        </Link>
        <Link className="button-link" to="/lessons">
          <li className="scroll-box-button">Lessons</li>
        </Link>
        <Link className="button-link" to="/account">
          <li className="scroll-box-button">Account</li>
        </Link>
      </ul>
    </div>
  );
}

export default Dashboard;
