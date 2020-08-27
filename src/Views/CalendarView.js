import React from "react";

class CalendarView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teacher: this.props.teacher,
      teacherId: this.props.teacherId,
      teacherToken: this.props.teacherToken,
      calendarName: "",
    };
  }

  componentDidMount() {
    this.getCalendarName();
  }

  async getCalendarName() {
    await fetch("/teacher/" + this.state.teacherId + "/calendar", {
      headers: {
        Content: "application/json",
        Authorization: "Bearer " + this.state.teacherToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({ calendarName: res.calendarName });
      });
  }

  render() {
    let calendarUrl = "";
    if (this.state.calendarName) {
      calendarUrl =
        "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%230B8043&ctz=America%2FChicago&src=" +
        this.state.calendarName +
        "&color=%23039BE5&color=%2333B679&color=%230B8043&showTitle=0&showNav=1&showPrint=0&showDate=1&showTabs=0&showCalendars=0";
    }

    return (
      <iframe
        title={this.state.calendarName}
        src={calendarUrl}
        className="calendar-frame"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    );
  }
}

export default CalendarView;
