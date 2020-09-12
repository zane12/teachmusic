import React, { useState } from "react";
import "../Login/Login.css";

export default function AccountView(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  return (
    <div className="content" style={{ width: "80%", maxWidth: "80%" }}>
      <p className="content-text" style={{ textAlign: "center" }}>
        Change Account Info
      </p>
      <div className="account-form">
        <form
          onSubmit={(e) => {
            const info = {
              name,
              email,
              newEmail,
              password,
              newPassword,
              confirmNewPassword,
              teacherId: props.teacherId,
            };
            onSubmitForm(e, info, () => {
              setName("");
              setEmail("");
              setNewEmail("");
              setPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
            });
          }}
        >
          <input
            type="text"
            id="Name"
            className="login-input-text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
          <br />
          <br />

          <input
            type="text"
            id="Email"
            className="login-input-text"
            placeholder="Current Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <br />
          <br />
          <input
            type="text"
            id="changeEmail"
            className="login-input-text"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
            }}
          ></input>
          <br />
          <br />
          <input
            type="password"
            id="Password"
            className="login-input-text"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <br />
          <br />

          <input
            type="password"
            id="newPassword"
            className="login-input-text"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          ></input>
          <br />
          <br />
          <input
            type="password"
            id="confirmNewPassword"
            className="login-input-text"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
            }}
          ></input>
          <br />
          <br />

          <button className="login-input-button">Confirm</button>
        </form>
      </div>
    </div>
  );
}

async function onSubmitForm(e, props, clear) {
  e.preventDefault();
  const teacherId = props.teacherId;
  delete props.teacherId;
  const fetchOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + window.sessionStorage.getItem("token"),
    },
    body: JSON.stringify(props),
  };

  await fetch(
    process.env.REACT_APP_SERVER_URL + "/teacher/" + teacherId,
    fetchOptions
  ).then((res) => {
    if (res.status === 200) {
      clear();
    }
  });
  return null;
}
