import React from "react";
import "./dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherName: this.props.teacher,
    };
  }

  render() {
    return (
      <div>
        <p className="teacher-name">{this.state.teacherName}</p>
        <ul>
          <li
            onClick={this.props.onStudentsPress}
            className="scroll-box-button"
          >
            Students
          </li>
          <li
            onClick={this.props.onCalendarPress}
            className="scroll-box-button"
          >
            Calendar
          </li>
          <li onClick={this.props.onLessonsPress} className="scroll-box-button">
            Lessons
          </li>
          <li onClick={this.props.onAccountPress} className="scroll-box-button">
            Account
          </li>
        </ul>
      </div>
    );
  }
}

export default Dashboard;
