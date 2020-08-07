import React from "react";
import "./datetime.css";
import "./addStudent.css";
import Datetime from "react-datetime";
import moment from "moment";

class AddStudentCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPressed: false,
      dateDisplayValue: "First Lesson Date/Time",
      dateValue: "",
      dateError: "",
      sName: "",
      sNameError: "",
      cName: "",
      cNameError: "",
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
    };

    const newStudent = {
      name: this.state.sName,
      contactName: this.state.cName,
      lessonTime,
      email: this.state.email,
      contactPhone: this.state.phoneNumber,
    };

    await fetch("/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
            dateValue: "",
            sName: "",
            cName: "",
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
        if (errors.contactName) {
          this.setState({
            cNameError: "Required field (even if same as above)",
          });
        } else {
          this.setState({
            cNameError: "",
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

  contactNameHandler(e) {
    this.setState({ cName: e.target.value });
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
              placeholder="Contact Name"
              value={this.state.cName}
              onChange={this.contactNameHandler.bind(this)}
            ></input>
            <p className="input-error-text">{this.state.cNameError}</p>
            <Datetime
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

          <button
            className="content-button"
            href=""
            onClick={() => {
              this.setState({ isPressed: !this.state.isPressed });
            }}
          >
            Add New Student
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
