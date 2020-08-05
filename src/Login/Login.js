import React from "react";
import "./Login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: false,
      addRegisterInput: false,
      emailValue: "",
      passwordValue: "",
      errorMessage: "",
    };

    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
  }

  registerEmailHandler() {
    let registerEmailInput = null;

    if (this.state.addRegisterInput) {
      registerEmailInput = (
        <div>
          <input
            className="login-input-text"
            type="text"
            name="email-confirm"
            placeholder="Confirm E-mail"
          ></input>
          <br />
          <br />
        </div>
      );
    }
    return registerEmailInput;
  }

  registerPasswordHandler() {
    let registerPasswordInput = null;

    if (this.state.addRegisterInput) {
      registerPasswordInput = (
        <div>
          <input
            className="login-input-text"
            type="text"
            name="password-confirm"
            placeholder="Confirm Password"
          ></input>
          <br />
          <br />
        </div>
      );
    }

    return registerPasswordInput;
  }

  onRegisterClick(event) {
    event.preventDefault();
    this.setState({
      register: !this.state.register,
    });

    if (this.state.register) {
      this.setState({
        addRegisterInput: false,
      });
    }
  }

  onEnterClick(event) {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.emailValue,
        password: this.state.passwordValue,
      }),
    };

    fetch("http://10.0.0.38:8080/teacher/login", requestOptions)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("User not found.");
        }
      })
      .then((data) => {
        window.sessionStorage.setItem("token", data.token);
        window.sessionStorage.setItem("teacher", data.teacher.name);
        window.sessionStorage.setItem("teacherId", data.teacher._id);
      })
      .then((res) => {
        this.props.onLogin();
      })
      .catch((e) => this.setState({ errorMessage: e.message }));
  }

  emailChangeHandler(event) {
    this.setState({ emailValue: event.target.value });
  }

  passwordChangeHandler(event) {
    this.setState({ passwordValue: event.target.value });
  }

  render() {
    let loginContainer = "login-container";

    if (this.state.register) {
      loginContainer += " expand-login-container";
    }

    return (
      <div
        className={loginContainer}
        onTransitionEnd={() => {
          this.setState({ addRegisterInput: this.state.register });
        }}
      >
        <div className="login-box">
          <form onTransitionEnd={(event) => event.stopPropagation()}>
            <input
              className="login-input-text"
              type="text"
              name="email"
              placeholder="E-mail"
              value={this.state.emailValue}
              onChange={this.emailChangeHandler}
            ></input>
            <br />
            <br />
            {this.registerEmailHandler()}
            <input
              className="login-input-text"
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.passwordValue}
              onChange={this.passwordChangeHandler}
            ></input>
            <br />
            <br />
            {this.registerPasswordHandler()}
            <button
              className="login-input-button"
              name="submitlogin"
              onClick={this.onEnterClick.bind(this)}
            >
              {" "}
              Enter{" "}
            </button>
            <br />
            <br />
            <button
              className="login-input-button"
              name="Register"
              onClick={this.onRegisterClick.bind(this)}
            >
              Register
            </button>
          </form>
        </div>
        <div>
          <p className="login-error">{this.state.errorMessage}</p>
        </div>
      </div>
    );
  }
}

export default Login;
