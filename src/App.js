import React from "react";
import StudentCard from "./Cards/StudentCard";

import Login from "./Login/Login";
import "./App.css";
import Dashboard from "./Dashboard/Dashboard";
import AddStudentCard from "./Cards/AddStudentCard";

class App extends React.Component {
  state = {
    refresh: true,
    students: [],
    loggedInAsTeacher: false,
    teacher: undefined,
    teacherId: undefined,
    teacherToken: undefined,
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
        token: window.sessionStorage.getItem("token"),
      });
    }
  }

  async refreshContent() {
    if (this.state.refresh) {
      await fetch("/student", { headers: { Authorization: this.state.token } })
        .then((res, req) => {
          const response = res.json();

          return response;
        })
        .then((response) => {
          return this.setState({ students: response });
        })
        .catch((e) => {
          console.log(e);
        });

      this.setState({ refresh: false });
    }
  }

  contentCardHandler(students) {
    let studentContent = null;

    studentContent = students.map((student) => {
      return <StudentCard student={student} key={student._id} />;
    });

    return studentContent;
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
      students: [],
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
    if (this.state.loggedInAsTeacher) {
      this.refreshContent();
      return (
        <div style={{ maxWidth: "940px" }}>
          {" "}
          <div className="scroll-box">
            <Dashboard
              teacher={this.state.teacher}
              teacherId={this.state.teacherId}
            />
            <p onClick={this.handleLogout.bind(this)}>Logout</p>
          </div>
          <div className="main-box">
            <div className="main-color-box">
              <div className="header-box">
                <h1>Teachmusic</h1>
              </div>
              {this.contentCardHandler(this.state.students)}
              <AddStudentCard
                refresh={() => {
                  this.setState({ refresh: true });
                  this.refreshContent();
                }}
              />
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
