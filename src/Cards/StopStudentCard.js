import React from "react";
import Datetime from "react-datetime";
import moment from "moment";

class StopStudentCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateValue: new Date(),
      dateIsChanged: false,
      dateDisplayValue: "Stop Date",
    };
  }

  dateValidator(current, selected) {
    const yesterday = Datetime.moment().subtract(1, "day");
    return current.isAfter(yesterday);
  }

  dateChangeHandler(dateValue) {
    this.setState({ dateValue, dateChanged: true });

    const dateDisplayValue = moment(dateValue).format("ddd MMM Do");

    this.setState({ dateDisplayValue });
  }

  async onStopSubmit(e) {
    e.preventDefault();

    if (this.state.dateChanged) {
      const lessonTime = {
        lessonDay: moment(this.state.dateValue).day(),
        lessonHour: 0,
        lessonMinute: 0,
        firstLesson: this.state.dateValue,
      };

      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ lessonTime, endLessons: true }),
      };

      await fetch("/student/" + this.props.student._id, requestOptions).then(
        (res) => {
          if (res.status === 200) {
            this.props.exit();
          } else {
            console.log(res);
          }
        }
      );
    }
  }

  render() {
    return (
      <form onSubmit={this.onStopSubmit.bind(this)}>
        <label className="content-text content-details">
          Choose the date to stop lessons. <br />
          Cancels all lessons on or after date
        </label>
        <Datetime
          timeFormat={false}
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
}

export default StopStudentCard;
