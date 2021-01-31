import React from "react";
import "./datetime.css";
import "./studentForm.css";
import Datetime from "react-datetime";
import moment from "moment";

class AddStudentCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPressed: false,
      dateDisplayValue: "First Lesson Date/Time",
      dateValue: new Date(),
      dateError: "",
      sName: "",
      sNameError: "",
      cFirstName: "",
      cFirstNameError: "",
      cLastName: "",
      cLastNameError: "",
      email: "",
      emailError: "",
      phoneNumber: "",
      phoneError: "",
    };
  }

  //submits new student form
  async newStudentFormHandler(e) {
    e.preventDefault();

    const lessonTime = {
      lessonDay: moment(this.state.dateValue).day(),
      lessonHour: moment(this.state.dateValue).hour(),
      lessonMinute: moment(this.state.dateValue).minute(),
      firstLesson: this.state.dateValue,
    };

    const newStudent = {
      name: this.state.sName,
      contactFirstName: this.state.cFirstName,
      contactLastName: this.state.cLastName,
      lessonTime,
      email: this.state.email,
      contactPhone: this.state.phoneNumber,
    };

    await fetch(process.env.REACT_APP_SERVER_URL + "/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify(newStudent),
    })
      .then(async (res) => {
        if (res.status === 201) {
          console.log("student created successfully");
          this.props.refresh();
          this.setState({
            isPressed: false,
            dateDisplayValue: "First Lesson Date/Time",
            dateValue: new Date(),
            sName: "",
            cFirstName: "",
            cLastName: "",
            email: "",
            phoneNumber: "",
          });
        } else {
          const body = await res.json();

          throw new Error(JSON.stringify(body));
        }
      })
      .catch((e) => {
        const error = JSON.parse(e.message);
        const errors = error.errors;
        console.log(errors);

        if (errors.name) {
          this.setState({ sNameError: "Required field" });
        } else {
          this.setState({ sNameError: "" });
        }
        if (errors.contactFirstName) {
          this.setState({
            cFirstNameError: "Required field (even if same as above)",
          });
        } else {
          this.setState({
            cLastNameError: "",
          });
        }
        if (errors.contactLastName) {
          this.setState({
            cLastNameError: "Required field (even if same as above)",
          });
        } else {
          this.setState({
            cLastNameError: "",
          });
        }
        if (
          errors["lessonTime.lessonDay"] ||
          errors["lessonTime.lessonHour"] ||
          errors["lessontTime.lessonMinute"]
        ) {
          this.setState({ dateError: "Invalid date" });
        } else {
          this.setState({ dateError: "" });
        }
        if (errors.email) {
          this.setState({ emailError: "Email is invalid/taken" });
        } else {
          this.setState({ emailError: "" });
        }
        if (errors.contactPhone) {
          this.setState({ phoneError: "Phone number is invalid" });
        } else {
          this.setState({ phoneError: "" });
        }
      });
  }

  //text input handlers
  studentNameHandler(e) {
    this.setState({ sName: e.target.value });
  }

  contactFirstNameHandler(e) {
    this.setState({ cFirstName: e.target.value });
  }

  contactLastNameHandler(e) {
    this.setState({ cLastName: e.target.value });
  }

  emailHandler(e) {
    this.setState({ email: e.target.value });
  }

  phoneNumberHandler(e) {
    this.setState({ phoneNumber: e.target.value });
  }

  //Datetime input handlers
  dateValidator(current, selected) {
    const yesterday = Datetime.moment().subtract(1, "day");
    return current.isAfter(yesterday);
  }

  dateChangeHandler(dateValue) {
    this.setState({ dateValue });

    const dateDisplayValue = moment(dateValue).format("ddd MMM Do [at] h:mm a");

    this.setState({ dateDisplayValue });
  }

  //Shows this form after button press
  studentFormHandler() {
    let studentForm = null;
    if (this.state.isPressed) {
      studentForm = (
        <div>
          <button
            className="close-content content-button"
            onClick={() => {
              this.setState({ isPressed: false });
            }}
          >
            X
          </button>
          <form onSubmit={this.newStudentFormHandler.bind(this)}>
            <input
              className="student-input-text"
              type="text"
              placeholder="Student Name"
              value={this.state.sName}
              onChange={this.studentNameHandler.bind(this)}
            ></input>
            <p className="input-error-text">{this.state.sNameError}</p>
            <input
              className="student-input-text"
              type="text"
              placeholder="Contact First Name"
              value={this.state.cFirstName}
              onChange={this.contactFirstNameHandler.bind(this)}
            ></input>
            <input
              className="student-input-text"
              type="text"
              placeholder="Contact Last Name"
              value={this.state.cLastName}
              onChange={this.contactLastNameHandler.bind(this)}
            ></input>
            <p className="input-error-text">{this.state.cNameError}</p>
            <Datetime
              utc={true}
              isValidDate={this.dateValidator}
              timeConstraints={{ minutes: { step: 15 } }}
              inputProps={{
                type: "button",
                className: "content-button calendar-button",
                value: this.state.dateDisplayValue,
              }}
              onChange={this.dateChangeHandler.bind(this)}
            />
            <p className="input-error-text">{this.state.dateError}</p>
            <input
              className="student-input-text"
              type="text"
              placeholder="Contact Email"
              value={this.state.email}
              onChange={this.emailHandler.bind(this)}
            ></input>
            <p className="input-error-text">{this.state.emailError}</p>
            <input
              className="student-input-text"
              type="text"
              placeholder="Contact Phone #"
              value={this.state.phoneNumber}
              onChange={this.phoneNumberHandler.bind(this)}
            ></input>
            <p className="input-error-text">{this.state.phoneError}</p>
            <input
              className="content-button submit-button"
              type="submit"
              value="Add"
            ></input>
          </form>
        </div>
      );
    } else {
      studentForm = (
        <div>
          <p className="content-text">
            Add New Student <br />
          </p>
          <p
            style={{ color: "white" }}
            className="content-text content-details"
          >
            .
          </p>
          <button
            className="content-button"
            href=""
            onClick={() => {
              this.setState({ isPressed: !this.state.isPressed });
            }}
          >
            Add
          </button>
        </div>
      );
    }

    return studentForm;
  }

  render() {
    return <div className="content">{this.studentFormHandler()}</div>;
  }
}

export default AddStudentCard;
