import React from "react";
import moment from "moment";
import ChangeStudentCard from "./ChangeStudentCard";
import StopStudentCard from "./StopStudentCard";

class StudentCard extends React.Component {
  state = {
    infoIsPressed: false,
    changeIsPressed: false,
    stopIsPressed: false,
    isPressed: true,
  };

  addInfo() {
    if (this.state.infoIsPressed) {
      return (
        <span key={this.props.student._id}>
          <p className="content-text content-details">
            Contact: {this.props.student.contactName}
          </p>
          <p className="content-text content-details">
            Email: {this.props.student.email}
          </p>
          <p className="content-text content-details">
            Phone: {this.props.student.contactPhone}
          </p>
        </span>
      );
    }
    return null;
  }
  render() {
    const lessonDate = new Date();
    const lessonMoment = moment(lessonDate);
    lessonMoment.hour(this.props.student.lessonTime.lessonHour);
    lessonMoment.day(this.props.student.lessonTime.lessonDay);
    lessonMoment.minute(this.props.student.lessonTime.lessonMinute);

    const timeString = lessonMoment.format("dddd [at] h:mm a");

    let cardContent = [
      <p key={this.props.student._id + "-1"} className="content-text">
        {this.props.student.name}
      </p>,
      <p
        key={this.props.student._id + "-2"}
        className="content-text content-details"
      >
        {timeString}
      </p>,
    ];

    cardContent.push(this.addInfo());

    if (this.state.changeIsPressed) {
      cardContent = [
        <div key={this.props.student._id}>
          <button
            className="close-content content-button"
            onClick={() => {
              this.setState({ changeIsPressed: false });
            }}
          >
            X
          </button>
          <ChangeStudentCard
            exit={() => {
              this.props.refresh();
              this.setState({ changeIsPressed: false });
            }}
            student={this.props.student}
          />
        </div>,
      ];
    } else if (this.state.stopIsPressed) {
      cardContent = [
        <div key={this.props.student._id}>
          <button
            className="close-content content-button"
            onClick={() => {
              this.setState({ stopIsPressed: false });
            }}
          >
            X
          </button>
          <StopStudentCard
            exit={() => {
              this.props.refresh();
              this.setState({ stopIsPressed: false });
            }}
            student={this.props.student}
          />
        </div>,
      ];
    } else {
      cardContent.push(
        <button
          key={this.props.student._id + "-Info"}
          className="content-button"
          href=""
          onClick={() => {
            this.setState({ infoIsPressed: !this.state.infoIsPressed });
          }}
        >
          Info
        </button>
      );
      cardContent.push(
        <button
          key={this.props.student._id + "-Change"}
          className="content-button"
          href=""
          onClick={() => {
            this.setState({ changeIsPressed: !this.state.changeIsPressed });
          }}
        >
          Change
        </button>
      );
      cardContent.push(
        <button
          key={this.props.student._id + "-Stop"}
          className="content-button"
          href=""
          onClick={() => {
            this.setState({ stopIsPressed: !this.state.stopIsPressed });
          }}
        >
          Stop
        </button>
      );
    }

    return (
      <div
        style={this.props.style}
        className="content"
        key={this.props.student._id}
      >
        {cardContent}
      </div>
    );
  }
}

export default StudentCard;
