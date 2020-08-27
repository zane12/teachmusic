import React from "react";
import moment from "moment";

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lessons: this.props.lessons,
      applyFilter: this.props.filter,
      todaySelected: false,
      weekSelected: false,
      taughtSelected: false,
      allSelected: true,
      filtered: false,
    };
  }

  componentDidUpdate() {
    if (this.state.todaySelected) {
      this.filterToday();
    }

    if (this.state.weekSelected) {
      this.filterWeek();
    }

    if (this.state.taughtSelected) {
      this.filterTaught();
    }

    if (this.state.untaughtSelected) {
      this.filterUntaught();
    }

    if (this.state.allSelected && !this.state.filtered) {
      this.setState({ filtered: true });

      this.state.applyFilter(this.props.lessons);
    }
  }

  filterToday() {
    const filteredLessons = [];

    if (!this.state.filtered) {
      this.setState({ filtered: true });

      if (this.props.lessons.length === 0) {
        return null;
      }
      this.props.lessons.forEach((stu, index) => {
        let filteredStu = {};

        filteredStu.lessons = stu.lessons.filter((lesson) => {
          return moment(lesson.lessonDate).isSame(moment(new Date()), "day");
        });

        filteredStu.student = stu.student;
        if (filteredStu.lessons.length > 0) {
          return (filteredLessons[index] = filteredStu);
        } else {
          return null;
        }
      });

      this.state.applyFilter(filteredLessons);
    }
  }

  filterWeek() {
    const filteredLessons = [];

    if (!this.state.filtered) {
      this.setState({ filtered: true });

      if (this.props.lessons.length === 0) {
        return null;
      }
      this.props.lessons.forEach((stu, index) => {
        let filteredStu = {};

        filteredStu.lessons = stu.lessons.filter((lesson) => {
          return moment(lesson.lessonDate).isSame(moment(new Date()), "week");
        });

        filteredStu.student = stu.student;
        if (filteredStu.lessons.length > 0) {
          return (filteredLessons[index] = filteredStu);
        } else {
          return null;
        }
      });

      this.state.applyFilter(filteredLessons);
    }
  }

  filterTaught() {
    const filteredLessons = [];

    if (!this.state.filtered) {
      this.setState({ filtered: true });

      if (this.props.lessons.length === 0) {
        return null;
      }
      this.props.lessons.forEach((stu, index) => {
        let filteredStu = {};

        filteredStu.lessons = stu.lessons.filter((lesson) => {
          return lesson.taught;
        });

        filteredStu.student = stu.student;
        if (filteredStu.lessons.length > 0) {
          return (filteredLessons[index] = filteredStu);
        } else {
          return null;
        }
      });

      this.state.applyFilter(filteredLessons);
    }
  }

  filterUntaught() {
    const filteredLessons = [];

    if (!this.state.filtered) {
      this.setState({ filtered: true });

      if (this.props.lessons.length === 0) {
        return null;
      }
      this.props.lessons.forEach((stu, index) => {
        let filteredStu = {};

        filteredStu.lessons = stu.lessons.filter((lesson) => {
          return lesson.taught === false;
        });

        filteredStu.student = stu.student;
        if (filteredStu.lessons.length > 0) {
          return (filteredLessons[index] = filteredStu);
        } else {
          return null;
        }
      });

      this.state.applyFilter(filteredLessons);
    }
  }

  render() {
    return (
      <ul className="filters">
        <label>Filter by: </label>
        <li
          onClick={() =>
            this.setState({
              todaySelected: true,
              weekSelected: false,
              taughtSelected: false,
              allSelected: false,
              filtered: false,
              untaughtSelected: false,
            })
          }
          className={
            this.state.todaySelected
              ? "lesson-filters filters-selected"
              : "lesson-filters"
          }
        >
          {" "}
          Today{" "}
        </li>
        <li
          onClick={() =>
            this.setState({
              todaySelected: false,
              weekSelected: true,
              taughtSelected: false,
              allSelected: false,
              filtered: false,
              untaughtSelected: false,
            })
          }
          className={
            this.state.weekSelected
              ? "lesson-filters filters-selected"
              : "lesson-filters"
          }
        >
          {" "}
          This week{" "}
        </li>
        <li
          onClick={() =>
            this.setState({
              todaySelected: false,
              weekSelected: false,
              taughtSelected: true,
              allSelected: false,
              filtered: false,
              untaughtSelected: false,
            })
          }
          className={
            this.state.taughtSelected
              ? "lesson-filters filters-selected"
              : "lesson-filters"
          }
        >
          {" "}
          Taught{" "}
        </li>
        <li
          onClick={() =>
            this.setState({
              todaySelected: false,
              weekSelected: false,
              taughtSelected: false,
              untaughtSelected: true,
              allSelected: false,
              filtered: false,
            })
          }
          className={
            this.state.untaughtSelected
              ? "lesson-filters filters-selected"
              : "lesson-filters"
          }
        >
          {" "}
          Untaught{" "}
        </li>
        <li
          onClick={() =>
            this.setState({
              todaySelected: false,
              weekSelected: false,
              taughtSelected: false,
              allSelected: true,
              filtered: false,
              untaughtSelected: false,
            })
          }
          className={
            this.state.allSelected
              ? "lesson-filters filters-selected"
              : "lesson-filters"
          }
        >
          {" "}
          All{" "}
        </li>
      </ul>
    );
  }
}

export default Filter;
