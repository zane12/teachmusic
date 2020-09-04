import React from "react";
import moment from "moment";
import Datetime from "react-datetime";

class LessonCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      markClicked: false,
      changeClicked: false,
      viewClicked: false,
      showOptions: false,
      lessonOption: this.props.student.lessons[0]._id,
      dateDisplayValue: "Reschedule Date/Time",
      dateValue: new Date(),
      dateChanged: false,
    };
  }

  dateChangeHandler(dateValue) {
    this.setState({ dateValue, dateChanged: true });

    const dateDisplayValue = moment(dateValue).format("ddd MMM Do [at] h:mm a");

    this.setState({ dateDisplayValue });
  }

  dateValidator(current, selected) {
    const yesterday = Datetime.moment().subtract(1, "day");
    return current.isAfter(yesterday);
  }

  clickMark() {
    this.setState({ markClicked: true, showOptions: true });
  }

  async markTaught() {
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        taught: true,
        cancelled: false,
        noShow: false,
      }),
    };

    await fetch(
      process.env.REACT_APP_SERVER_URL + "/lessons/" + this.state.lessonOption,
      requestOptions
    ).then((res) => {
      if (res.status === 200) {
        this.setState({ markClicked: false, showOptions: false });
        this.props.refresh();
      } else {
        console.log(res);
      }
    });
  }

  async markCancelled() {
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        cancelled: true,
        taught: false,
        noShow: false,
      }),
    };

    await fetch(
      process.env.REACT_APP_SERVER_URL + "/lessons/" + this.state.lessonOption,
      requestOptions
    ).then((res) => {
      if (res.status === 200) {
        this.setState({ markClicked: false, showOptions: false });
        this.props.refresh();
      } else {
        console.log(res);
      }
    });
  }

  async markNoshow() {
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        noShow: true,
        taught: false,
        cancelled: false,
      }),
    };

    await fetch(
      process.env.REACT_APP_SERVER_URL + "/lessons/" + this.state.lessonOption,
      requestOptions
    ).then((res) => {
      if (res.status === 200) {
        this.setState({ markClicked: false, showOptions: false });
        this.props.refresh();
      } else {
        console.log(res);
      }
    });
  }

  clickChange() {
    this.setState({ changeClicked: true, showOptions: true });
  }

  async onChangeSubmit() {
    if (this.state.dateChanged) {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          lessonDate: this.state.dateValue,
        }),
      };

      await fetch(
        process.env.REACT_APP_SERVER_URL +
          "/lessons/" +
          this.state.lessonOption,
        requestOptions
      ).then((res) => {
        if (res.status === 200) {
          this.setState({
            changeClicked: false,
            showOptions: false,
            dateValue: new Date(),
            dateChanged: false,
            dateDisplayValue: "Reschedule Date/Time",
          });
          this.props.refresh();
        } else {
          console.log(res);
        }
      });
    }
  }

  clickView() {
    this.setState({ viewClicked: true });
  }

  optionChangeHandler(option) {
    this.setState({ lessonOption: option.target.value });
  }

  render() {
    if (!this.props.student.lessons) {
      return null;
    }

    const lessonMoment = moment(
      this.props.student.lessons[0].lessonDate
    ).format("[Next Lesson: ]MM/DD/YYYY");

    const lessonTime = new Date();
    lessonTime.setHours(
      this.props.student.student.lessonTime.lessonHour,
      this.props.student.student.lessonTime.lessonMinute,
      0,
      0
    );

    const lessonTimeString = moment(lessonTime).format("h:mm a");

    const lessonOptions = [];
    this.props.student.lessons.map((lesson) => {
      return lessonOptions.push(
        <option value={lesson._id} key={lesson._id}>
          {moment(lesson.lessonDate).format("MM/DD/YYYY")}
        </option>
      );
    });

    let options = null;

    if (this.state.showOptions) {
      options = (
        <div>
          <br />
          <label className="content-details content-select">
            Date to Change
          </label>
          <select
            onChange={this.optionChangeHandler.bind(this)}
            className="content-text content-select"
          >
            {lessonOptions}
          </select>
        </div>
      );
    }

    if (this.state.markClicked) {
      return (
        <div className="content">
          <button
            className="close-content content-button"
            onClick={() => {
              this.setState({
                markClicked: false,
                changeClicked: false,
                viewClicked: false,
                showOptions: false,
                lessonOption: this.props.student.lessons[0]._id,
              });
            }}
          >
            X
          </button>
          <label>Mark as:</label>
          <br />
          <br />
          <button
            onClick={this.markTaught.bind(this)}
            className="content-button"
          >
            Taught
          </button>
          <button
            onClick={this.markCancelled.bind(this)}
            className="content-button"
          >
            Cancelled
          </button>
          <button
            onClick={this.markNoshow.bind(this)}
            className="content-button"
          >
            No-show
          </button>
          {options}
        </div>
      );
    }

    if (this.state.changeClicked) {
      return (
        <div className="content">
          <button
            className="close-content content-button"
            onClick={() => {
              this.setState({
                markClicked: false,
                changeClicked: false,
                viewClicked: false,
                showOptions: false,
                lessonOption: this.props.student.lessons[0]._id,
                dateDisplayValue: "Reschedule Date/Time",
                dateValuee: new Date(),
                dateChanged: false,
              });
            }}
          >
            X
          </button>
          <p className="content-text">Reschedule</p>
          {options}
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
          <button
            onClick={this.onChangeSubmit.bind(this)}
            className="content-button submit-button"
          >
            Confirm
          </button>
        </div>
      );
    }

    if (this.state.viewClicked) {
      const lessons = [];
      const lessonStatuses = [];

      const student = this.props.student.student.name;

      this.props.student.lessons.forEach((lesson) => {
        let lessonStatus = "Untaught";

        if (lesson.taught) {
          lessonStatus = "Taught";
        }
        if (lesson.cancelled) {
          lessonStatus = "Cancelled";
        }
        if (lesson.noShow) {
          lessonStatus = "No-show";
        }

        const lessonString = moment(lesson.lessonDate).format(
          "MM/DD/YYYY [at] h:mm a"
        );

        lessons.push(lessonString);
        lessonStatuses.push(lessonStatus);
      });
      return (
        <div className="content">
          <button
            className="close-content content-button"
            onClick={() => {
              this.setState({
                markClicked: false,
                changeClicked: false,
                viewClicked: false,
                showOptions: false,
                lessonOption: this.props.student.lessons[0]._id,
              });
            }}
          >
            X
          </button>
          <p className="content-text">{student}</p>
          {lessons.map((lesson, index) => {
            return (
              <div className="content-details-border">
                <p className="content-details content-details-left">{lesson}</p>{" "}
                <p className="content-details">{lessonStatuses[index]}</p>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div key={this.props.student.student._id} className="content">
        <p className="content-text">{this.props.student.student.name}</p>
        <p className="content-text content-details">{lessonMoment}</p>
        <p className="content-text content-details">{lessonTimeString}</p>
        <button onClick={this.clickMark.bind(this)} className="content-button">
          Mark
        </button>

        <button
          onClick={this.clickChange.bind(this)}
          className="content-button"
        >
          Change
        </button>
        <button onClick={this.clickView.bind(this)} className="content-button">
          View
        </button>
        {options}
      </div>
    );
  }
}

export default LessonCard;
