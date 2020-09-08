import React from "react";
import "../Login/Login.css";

class AccountView extends React.Component {
  render() {
    return (
      <div className="content" style={{ width: "80%", maxWidth: "80%" }}>
        <p className="content-text" style={{ textAlign: "center" }}>
          Change Account Info
        </p>
        <div className="account-form">
          <form>
            <input
              type="text"
              className="login-input-text"
              placeholder="Name"
            ></input>
            <br />
            <br />

            <input
              type="text"
              className="login-input-text"
              placeholder="Email"
            ></input>
            <br />
            <br />
            <input
              type="password"
              className="login-input-text"
              placeholder="Password"
            ></input>
            <br />
            <br />

            <input
              type="password"
              className="login-input-text"
              placeholder="New Password"
            ></input>
            <br />
            <br />
            <input
              type="password"
              className="login-input-text"
              placeholder="Confirm New Password"
            ></input>
            <br />
            <br />

            <button className="login-input-button">Confirm</button>
          </form>
        </div>
      </div>
    );
  }
}

export default AccountView;
