import React from "react";
import { Link } from "react-router-dom";

import "./dashboard.css";

function Dashboard(props) {
  const teacherName = props.teacher;
  const click = props.click;

  return (
    <div>
      <p className="teacher-name">{teacherName}</p>
      <ul>
        <Link className="button-link" to="/students">
          <li onClick={click} className="scroll-box-button">
            Students
          </li>
        </Link>
        <Link className="button-link" to="/calendar">
          <li onClick={click} className="scroll-box-button">
            Calendar
          </li>
        </Link>
        <Link className="button-link" to="/lessons">
          <li onClick={click} className="scroll-box-button">
            Lessons
          </li>
        </Link>
        <Link className="button-link" to="/account">
          <li onClick={click} className="scroll-box-button">
            Account
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Dashboard;
