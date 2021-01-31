import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Login from "./Login/Login";
import "./App.css";
import Dashboard from "./Dashboard/Dashboard";

import CalendarView from "./Views/CalendarView";
import StudentView from "./Views/StudentView";
import LessonsView from "./Views/LessonsView";
import AccountView from "./Views/AccountView";
import PaymentView from './Views/PaymentView';

class App extends React.Component {
  state = {
    loggedInAsTeacher: false,
    teacher: undefined,
    teacherId: undefined,
    teacherToken: undefined,
    mobileDashboard: false,
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

  handleDashboard() {
    this.setState({
      mobileDashboard: !this.state.mobileDashboard,
    });
  }

  render() {
    if (this.state.loggedInAsTeacher) {
      let view = null;

      if (this.state.mobileDashboard) {
        view = (
          <div style={{ marginBottom: "-40px" }} className="scroll-box-mobile">
            <Dashboard
              click={this.handleDashboard.bind(this)}
              teacher={this.state.teacher}
            />
            <Link to="/">
              <p onClick={this.handleLogout.bind(this)}>Logout</p>
            </Link>
          </div>
        );
      } else {
        view = (
          <Switch>
            <Route path="/students">
              <StudentView
                teacher={this.state.teacher}
                teacherId={this.state.teacherId}
                teacherToken={this.state.teacherToken}
              />
            </Route>
            <Route path="/calendar">
              <CalendarView
                teacher={this.state.teacher}
                teacherId={this.state.teacherId}
                teacherToken={this.state.teacherToken}
              />
            </Route>
            <Route path="/lessons">
              <LessonsView
                teacher={this.state.teacher}
                teacherId={this.state.teacherId}
                teacherToken={this.state.teacherToken}
              />
            </Route>
            <Route path="/account">
              <AccountView
                teacher={this.state.teacher}
                teacherId={this.state.teacherId}
                teacherToken={this.state.teacherToken}
              />
            </Route>
            <Route path="/payment">
              <PaymentView
                teacher={this.state.teacher}
                teacherId={this.state.teacherId}
                teacherToken={this.state.teacherToken}
              />
            </Route>

            <Route path="/">
              <StudentView
                teacher={this.state.teacher}
                teacherId={this.state.teacherId}
                teacherToken={this.state.teacherToken}
              />
            </Route>
          </Switch>
        );
      }

      return (
        <div style={{ maxWidth: "940px" }}>
          {" "}
          <Router>
            <div className="scroll-box">
              <Dashboard
                click={() => {
                  return null;
                }}
                teacher={this.state.teacher}
              />
              <Link to="/">
                <p onClick={this.handleLogout.bind(this)}>Logout</p>{" "}
              </Link>
            </div>
            <div className="main-box">
              <div className="main-color-box">
                <div className="header-box">
                  <h1>
                    Teachmusic{" "}
                    <div className="navicon-container">
                      <img
                        onClick={this.handleDashboard.bind(this)}
                        className="navicon-container"
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                        src={require("./navicon.png")}
                        alt=""
                      ></img>
                    </div>
                  </h1>
                </div>

                {view}
              </div>
            </div>
          </Router>
        </div>
      );
    } else {
      return <Login onLogin={this.handleLogin.bind(this)} />;
    }
  }
}

export default App;
