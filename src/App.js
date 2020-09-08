import React from "react";

import Login from "./Login/Login";
import "./App.css";
import Dashboard from "./Dashboard/Dashboard";

import CalendarView from "./Views/CalendarView";
import StudentView from "./Views/StudentView";
import LessonsView from "./Views/LessonsView";
import AccountView from "./Views/AccountView";

class App extends React.Component {
  state = {
    loggedInAsTeacher: false,
    teacher: undefined,
    teacherId: undefined,
    teacherToken: undefined,
    calendarSelected: false,
    studentsSelected: true,
    lessonsSelected: false,
    accountSelected: false,
    dashboardSelected: false,
  };

  componentDidMount() {
    if (
      window.sessionStorage.getItem("teacher") &&
      window.sessionStorage.getItem("token") &&
      window.sessionStorage.getItem("teacherId")
    ) {
      this.setState({
        loggedInAsTeacher: true,
        teacher: window.sessionStorage.getItem("teacher"),
        teacherId: window.sessionStorage.getItem("teacherId"),
        teacherToken: window.sessionStorage.getItem("token"),
      });
    }
  }

  clickNav() {
    this.setState({
      studentsSelected: false,
      calendarSelected: false,
      lessonsSelected: false,
      accountSelected: false,
      dashboardSelected: true,
    });
  }

  onStudentsPress(e) {
    this.setState({
      studentsSelected: true,
      calendarSelected: false,
      lessonsSelected: false,
      accountSelected: false,
      dashboardSelected: false,
    });
  }

  onCalendarPress(e) {
    this.setState({
      calendarSelected: true,
      studentsSelected: false,
      lessonsSelected: false,
      accountSelected: false,
      dashboardSelected: false,
    });
  }

  onLessonsPress(e) {
    this.setState({
      lessonsSelected: true,
      studentsSelected: false,
      calendarSelected: false,
      accountSelected: false,
      dashboardSelected: false,
    });
  }

  onAccountPress(e) {
    this.setState({
      accountSelected: true,
      lessonsSelected: false,
      calendarSelected: false,
      studentsSelected: false,
      dashboardSelected: false,
    });
  }

  handleLogin() {
    this.setState({
      loggedInAsTeacher: true,
      teacherToken: window.sessionStorage.getItem("token"),
      teacher: window.sessionStorage.getItem("teacher"),
      teacherId: window.sessionStorage.getItem("teacherId"),
    });
  }

  handleLogout() {
    this.setState({
      refresh: true,
      loggedInAsTeacher: false,
      teacher: undefined,
      teacherId: undefined,
      teacherToken: undefined,
    });
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("teacher");
    window.sessionStorage.removeItem("teacherId");
  }

  render() {
    let view = null;

    if (this.state.studentsSelected) {
      view = (
        <StudentView
          teacher={this.state.teacher}
          teacherId={this.state.teacherId}
          teacherToken={this.state.teacherToken}
        />
      );
    } else if (this.state.calendarSelected) {
      view = (
        <CalendarView
          teacher={this.state.teacher}
          teacherId={this.state.teacherId}
          teacherToken={this.state.teacherToken}
        />
      );
    } else if (this.state.lessonsSelected) {
      view = (
        <LessonsView
          teacher={this.state.teacher}
          teacherId={this.state.teacherId}
          teacherToken={this.state.teacherToken}
        />
      );
    } else if (this.state.accountSelected) {
      view = (
        <AccountView
          teacher={this.state.teacher}
          teacherId={this.state.teacherId}
          teacherToken={this.state.teacherToken}
        />
      );
    } else if (this.state.dashboardSelected) {
      view = (
        <div className="scroll-box-mobile">
          <Dashboard
            onStudentsPress={this.onStudentsPress.bind(this)}
            onCalendarPress={this.onCalendarPress.bind(this)}
            onLessonsPress={this.onLessonsPress.bind(this)}
            onAccountPress={this.onAccountPress.bind(this)}
            teacher={this.state.teacher}
          />
          <p onClick={this.handleLogout.bind(this)}>Logout</p>
        </div>
      );
    }
    if (this.state.loggedInAsTeacher) {
      return (
        <div style={{ maxWidth: "940px" }}>
          {" "}
          <div className="scroll-box">
            <Dashboard
              onStudentsPress={this.onStudentsPress.bind(this)}
              onCalendarPress={this.onCalendarPress.bind(this)}
              onLessonsPress={this.onLessonsPress.bind(this)}
              onAccountPress={this.onAccountPress.bind(this)}
              teacher={this.state.teacher}
            />
            <p onClick={this.handleLogout.bind(this)}>Logout</p>
          </div>
          <div className="main-box">
            <div className="main-color-box">
              <div className="header-box">
                <h1>
                  Teachmusic{" "}
                  <div className="navicon-container">
                    <img
                      className="navicon-container"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      src={require("./navicon.png")}
                      alt=""
                      onClick={this.clickNav.bind(this)}
                    ></img>
                  </div>
                </h1>
              </div>
              {view}
            </div>
          </div>
        </div>
      );
    } else {
      return <Login onLogin={this.handleLogin.bind(this)} />;
    }
  }
}

export default App;
