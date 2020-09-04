import React from "react";
import Datetime from "react-datetime";
import moment from "moment";

class ChangeStudentCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeChange: false,
      infoChange: false,
      student: this.props.student,
      dateChanged: false,
      dateDisplayValue: "First Lesson at New Time",
      dateValue: new Date(),
      sName: "",
      cName: "",
      email: "",
      phoneNumber: "",
    };
  }

  onTimeChange(e) {
    e.preventDefault();

    this.setState({ timeChange: true });
  }

  onInfoChange(e) {
    e.preventDefault();

    this.setState({ infoChange: true });
  }

  dateValidator(current, selected) {
    const yesterday = Datetime.moment().subtract(1, "day");
    return current.isAfter(yesterday);
  }

  dateChangeHandler(dateValue) {
    this.setState({ dateValue, dateChanged: true });

    const dateDisplayValue = moment(dateValue).format("ddd MMM Do [at] h:mm a");

    this.setState({ dateDisplayValue });
  }

  async changeLessonFormHandler(e) {
    e.preventDefault();

    if (this.state.dateChanged) {
      const lessonTime = {
        lessonDay: moment(this.state.dateValue).day(),
        lessonHour: moment(this.state.dateValue).hour(),
        lessonMinute: moment(this.state.dateValue).minute(),
        firstLesson: this.state.dateValue,
      };

      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ lessonTime }),
      };

      await fetch(
        process.env.REACT_APP_SERVER_URL + "/student/" + this.props.student._id,
        requestOptions
      ).then((res) => {
        if (res.status === 200) {
          this.props.exit();
        } else {
          console.log(res);
        }
      });
    }
  }

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

  async onInfoSubmit(e) {
    e.preventDefault();

    const body = {};

    if (this.state.sName !== "") {
      body.name = this.state.sName;
    }

    if (this.state.cName !== "") {
      body.contactName = this.state.cName;
    }

    if (this.state.email !== "") {
      body.email = this.state.email;
    }

    if (this.state.phoneNumber !== "") {
      body.contactPhone = this.state.phoneNumber;
    }

    if (body.name || body.contactName || body.email || body.contactPhone) {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.sessionStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      };

      await fetch(
        process.env.REACT_APP_SERVER_URL + "/student/" + this.props.student._id,
        requestOptions
      ).then((res) => {
        if (res.status === 200) {
          this.props.exit();
        } else {
          console.log(res);
        }
      });
    }
  }

  render() {
    let studentChangeCard = null;

    const lessonDate = new Date();
    const lessonMoment = moment(lessonDate);
    lessonMoment.hour(this.props.student.lessonTime.lessonHour);
    lessonMoment.day(this.props.student.lessonTime.lessonDay);
    lessonMoment.minute(this.props.student.lessonTime.lessonMinute);

    const timeString = lessonMoment.format("dddd [at] hh:mm a");

    if (this.state.timeChange) {
      studentChangeCard = (
        <form
          key={this.props.student._id}
          onSubmit={this.changeLessonFormHandler.bind(this)}
        >
          <label className="content-text content-details">
            {" "}
            This will change all future lessons as well. <br />
            To change just one lesson click here <br />
            <br />
            Current lesson time: <br />
            {timeString} <br />
          </label>
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
          <input
            className="content-button submit-button"
            type="submit"
            value="Confirm"
          ></input>
        </form>
      );
    }

    if (this.state.infoChange) {
      studentChangeCard = (
        <form
          key={this.props.student._id}
          onSubmit={this.onInfoSubmit.bind(this)}
        >
          <input
            className="student-input-text"
            type="text"
            placeholder="Student Name"
            value={this.state.sName}
            onChange={this.studentNameHandler.bind(this)}
          ></input>

          <input
            className="student-input-text"
            type="text"
            placeholder="Contact Name"
            value={this.state.cName}
            onChange={this.contactNameHandler.bind(this)}
          ></input>

          <input
            className="student-input-text"
            type="text"
            placeholder="Contact Email"
            value={this.state.email}
            onChange={this.emailHandler.bind(this)}
          ></input>

          <input
            className="student-input-text"
            type="text"
            placeholder="Contact Phone #"
            value={this.state.phoneNumber}
            onChange={this.phoneNumberHandler.bind(this)}
          ></input>
          <br />
          <input
            className="content-button submit-button"
            type="submit"
            value="Submit"
          ></input>
        </form>
      );
    }

    if (!this.state.timeChange && !this.state.infoChange) {
      studentChangeCard = (
        <form>
          <button
            onClick={this.onTimeChange.bind(this)}
            className="content-button change-student-button"
          >
            Change Time
          </button>
          <button
            onClick={this.onInfoChange.bind(this)}
            className="content-button change-student-button"
          >
            Change Info
          </button>
        </form>
      );
    }

    return <div>{studentChangeCard}</div>;
  }
}

export default ChangeStudentCard;
