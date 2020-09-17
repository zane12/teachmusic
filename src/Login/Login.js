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

    this.handleErrors = this.handleErrors.bind(this);
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
      showAuth: false,
      errorMessage: "",
    });

    if (this.state.register) {
      this.setState({
        addRegisterInput: false,
        addAuthButton: false,
      });
    }
  }

  handleErrors(error) {
    if (error.code === 11000) {
      this.setState({
        errorMessage: "There is already an account with this email",
      });
    } else if (error.errors.email) {
      this.setState({ errorMessage: error.errors.email.properties.message });
      return error;
    } else if (error.errors.password) {
      console.log(error.errors.password);
      if (error.errors.password.kind === "minlength") {
        this.setState({
          errorMessage:
            "Password must be at least 7 characters with at least one uppercase and one lowercase letter.",
        });
        return error;
      }

      this.setState({ errorMessage: error.errors.password.properties.message });
      return error;
    }

    return error;
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
        body.authorized = true;
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      await fetch(
        process.env.REACT_APP_SERVER_URL + "/teacher/login",
        requestOptions
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error("Email/Password combination not found.");
          }
        })
        .then((data) => {
          if (data.teacher.authorized || body.authorized) {
            window.sessionStorage.setItem("token", data.token);
            window.sessionStorage.setItem("teacher", data.teacher.name);
            window.sessionStorage.setItem("teacherId", data.teacher._id);
          } else {
            this.setState({
              showAuth: true,
              calendarAuth: data.calendarAuthURL,
            });

            throw new Error("Account not yet authorized for Google Calendar.");
          }
        })
        .then((res) => {
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
        await fetch(
          process.env.REACT_APP_SERVER_URL + "/teacher",
          requestOptions
        )
          .then(async (res) => {
            if (res.status === 201) {
              return res.json();
            } else {
              const e = await res.json();
              const error = JSON.stringify(e);

              throw new Error(error);
            }
          })
          .then((res) => {
            const calendarAuth = res.calendarAuthURL;
            this.setState({
              calendarAuth,
              showAuth: true,
              errorMessage:
                "Account created successfully. You must authorize with Google Calendar to use this app.",
            });
          })
          .catch(async (e) => {
            try {
              const error = JSON.parse(e.message);
              this.handleErrors(error);
            } catch {
              this.handleErrors(e);
            }
          });
      } else {
        this.setState({ errorMessage: "Email or passwords do not match." });
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
    } else if (this.state.showAuth) {
      loginContainer += " expand-login-container-less";
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
