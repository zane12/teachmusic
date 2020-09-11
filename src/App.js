import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useLocation,
} from "react-router-dom";

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

  render() {
    // if (this.state.dashboardSelected) {
    //   view = (
    //     <div className="scroll-box-mobile">
    //       <Dashboard teacher={this.state.teacher} />
    //       <p onClick={this.handleLogout.bind(this)}>Logout</p>
    //     </div>
    //   );
    // }

    if (this.state.loggedInAsTeacher) {
      return (
        <div style={{ maxWidth: "940px" }}>
          {" "}
          <Router>
            <div className="scroll-box">
              <Dashboard teacher={this.state.teacher} />
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
                      <Link
                        to={(props) => {
                          let toggle = "/dashboard";
                          if (props.pathname === "/dashboard") toggle = "/";
                          return toggle;
                        }}
                      >
                        <img
                          className="navicon-container"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                          src={require("./navicon.png")}
                          alt=""
                        ></img>
                      </Link>
                    </div>
                  </h1>
                </div>

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
                  <Route path="/dashboard">
                    <div className="scroll-box-mobile">
                      <Dashboard teacher={this.state.teacher} />
                      <p onClick={this.handleLogout.bind(this)}>Logout</p>
                    </div>
                  </Route>
                  <Route path="/">
                    <StudentView
                      teacher={this.state.teacher}
                      teacherId={this.state.teacherId}
                      teacherToken={this.state.teacherToken}
                    />
                  </Route>
                </Switch>
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
