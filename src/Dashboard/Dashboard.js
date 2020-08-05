import React from "react";
import "./dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherId: this.props.teacherId,
      teacherName: this.props.teacher,
    };
  }

  render() {
    return (
      <div>
        <p className="teacher-name">{this.state.teacherName}</p>
        <ul>
          <li className="scroll-box-button">Students</li>
          <li className="scroll-box-button">Calendar</li>
          <li className="scroll-box-button">Today's Lessons</li>
          <li className="scroll-box-button">Account</li>
        </ul>
      </div>
    );
  }
}

export default Dashboard;
