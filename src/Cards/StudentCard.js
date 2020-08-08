import React from "react";
import moment from "moment";

class StudentCard extends React.Component {
  state = {
    infoIsPressed: false,
    changeIsPressed: false,
    isPressed: true,
  };

  addInfo() {
    if (this.state.infoIsPressed) {
      return (
        <span>
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

    const timeString = lessonMoment.format("dddd [at] hh:mm a");

    let cardContent = [
      <p className="content-text">{this.props.student.name}</p>,
      <p className="content-text content-details">{timeString}</p>,
    ];

    cardContent.push(this.addInfo());

    if (this.state.changeIsPressed) {
      cardContent = [
        <button
          className="close-content content-button"
          onClick={() => {
            this.setState({ changeIsPressed: false });
          }}
        >
          X
        </button>,
      ];
    } else {
      cardContent.push(
        <button
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
          className="content-button"
          href=""
          onClick={() => {
            this.setState({ isPressed: !this.state.isPressed });
            console.log(this.state.isPressed);
          }}
        >
          Stop/Hold
        </button>
      );
    }

    return (
      <div className="content" key={this.props.student._id}>
        {cardContent}
      </div>
    );
  }
}

export default StudentCard;
