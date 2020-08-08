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
      confirmEmail: "",
      confirmPassword: "",
      registerInfo: false,
      registerName: "",
      calendarAuth: "",
      showAuth: false,
      addAuthButton: false,
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
            value={this.state.confirmEmail}
            onChange={(e) => {
              this.setState({ confirmEmail: e.target.value });
            }}
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
            type="password"
            name="password-confirm"
            placeholder="Confirm Password"
            value={this.state.confirmPassword}
            onChange={(e) => this.setState({ confirmPassword: e.target.value })}
          ></input>
          <br />
          <br />
        </div>
      );
    }

    return registerPasswordInput;
  }

  registerNameHandler() {
    let registerNameInput = null;

    if (this.state.addRegisterInput) {
      registerNameInput = (
        <div>
          <input
            className="login-input-text"
            type="text"
            name="name"
            placeholder="Full name"
            value={this.state.registerName}
            onChange={(e) => this.setState({ registerName: e.target.value })}
          ></input>
          <br />
          <br />
        </div>
      );
    }

    return registerNameInput;
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

  async onEnterClick(event) {
    event.preventDefault();

    if (!this.state.addRegisterInput) {
      // Handles logging in and (if present) sends calendar authorization code
      //  to server to store with teacher's tokens

      const params = new URLSearchParams(window.location.search);

      const body = {
        email: this.state.emailValue,
        password: this.state.passwordValue,
      };

      if (params.get("code")) {
        body.calendarAuthCode = params.get("code");
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      await fetch("/teacher/login", requestOptions)
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
          window.location = "/";
          this.props.onLogin();
        })
        .catch((e) => this.setState({ errorMessage: e.message }));
    } else {
      // Handles registration when the registration form is active
      if (
        this.state.emailValue.trim() === this.state.confirmEmail.trim() &&
        this.state.passwordValue.trim() === this.state.confirmPassword.trim()
      ) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.state.registerName,
            email: this.state.emailValue,
            password: this.state.passwordValue,
          }),
        };
        await fetch("/teacher", requestOptions)
          .then((res) => {
            if (res.status === 201) {
              return res.json();
            } else
              throw new Error(
                res.status.toString() + " Error creating account"
              );
          })
          .then((res) => {
            const calendarAuth = res.calendarAuthURL;
            this.setState({ calendarAuth, showAuth: true });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }

  emailChangeHandler(event) {
    this.setState({ emailValue: event.target.value });
  }

  passwordChangeHandler(event) {
    this.setState({ passwordValue: event.target.value });
  }

  authorizeButton() {
    if (this.state.addAuthButton) {
      return (
        <a
          href={this.state.calendarAuth}
          className="login-input-button auth-button"
          name="Authorize"
        >
          Authorize Google Calendar
        </a>
      );
    } else {
      return null;
    }
  }

  render() {
    let loginContainer = "login-container";
    let registerButtonText = "Register";

    if (this.state.register) {
      loginContainer += " expand-login-container";
      registerButtonText = "Cancel";
      if (this.state.showAuth) {
        loginContainer += " expand-expand-login-container";
      }
    }

    return (
      <div
        className={loginContainer}
        onTransitionEnd={() => {
          this.setState({
            addRegisterInput: this.state.register,
            addAuthButton: this.state.showAuth,
          });
        }}
      >
        <div className="login-box">
          <form onTransitionEnd={(event) => event.stopPropagation()}>
            {this.registerNameHandler()}
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
              {registerButtonText}
            </button>
            <br />
            <br />
            {this.authorizeButton()}
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
