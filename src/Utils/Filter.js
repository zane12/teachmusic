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
      markedSelected: false,
      unmarkedSelected: true,
      allSelected: false,
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

    if (this.state.markedSelected) {
      this.filterMarked();
    }

    if (this.state.unmarkedSelected) {
      this.filterUnmarked();
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

  filterMarked() {
    const filteredLessons = [];

    if (!this.state.filtered) {
      this.setState({ filtered: true });

      if (this.props.lessons.length === 0) {
        return null;
      }
      this.props.lessons.forEach((stu, index) => {
        let filteredStu = {};

        filteredStu.lessons = stu.lessons.filter((lesson) => {
          return lesson.taught || lesson.cancelled || lesson.noShow;
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

  filterUnmarked() {
    const filteredLessons = [];

    if (!this.state.filtered) {
      this.setState({ filtered: true });

      if (this.props.lessons.length === 0) {
        return null;
      }
      this.props.lessons.forEach((stu, index) => {
        let filteredStu = {};

        filteredStu.lessons = stu.lessons.filter((lesson) => {
          return (
            lesson.taught === false &&
            lesson.cancelled === false &&
            lesson.noShow === false
          );
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
              markedSelected: false,
              allSelected: false,
              filtered: false,
              unmarkedSelected: false,
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
              markedSelected: false,
              allSelected: false,
              filtered: false,
              unmarkedSelected: false,
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
              markedSelected: true,
              allSelected: false,
              filtered: false,
              unmarkedSelected: false,
            })
          }
          className={
            this.state.markedSelected
              ? "lesson-filters filters-selected"
              : "lesson-filters"
          }
        >
          {" "}
          Marked{" "}
        </li>
        <li
          onClick={() =>
            this.setState({
              todaySelected: false,
              weekSelected: false,
              markedSelected: false,
              unmarkedSelected: true,
              allSelected: false,
              filtered: false,
            })
          }
          className={
            this.state.unmarkedSelected
              ? "lesson-filters filters-selected"
              : "lesson-filters"
          }
        >
          {" "}
          Unmarked{" "}
        </li>
        <li
          onClick={() =>
            this.setState({
              todaySelected: false,
              weekSelected: false,
              markedSelected: false,
              allSelected: true,
              filtered: false,
              unmarkedSelected: false,
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
