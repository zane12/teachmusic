import React from "react";
import moment from "moment";

import Filter from "../Utils/Filter";
import LessonCard from "../Cards/LessonCard";

class LessonsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teacher: this.props.teacher,
      teacherId: this.props.teacherId,
      teacherToken: this.props.teacherToken,
      lessons: [],
      filteredLessons: [],
      showOptions: false,
      markClicked: false,
      cancelClicked: false,
      changeClicked: false,
    };
  }

  componentDidMount() {
    this.generateLessons();
  }

  async generateLessons() {
    const lessons = [];
    await fetch("/lessons", {
      headers: { Authorization: "Bearer " + this.state.teacherToken },
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        response.forEach((stu) => {
          lessons.push(stu);

          this.setState({ lessons });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  applyFilter(filteredLessons) {
    this.setState({ filteredLessons });
  }

  render() {
    this.state.filteredLessons.map((stu) => {
      if (stu.lessons) {
        stu.lessons.sort((a, b) => {
          const value =
            moment(a.lessonDate).date() - moment(b.lessonDate).date();

          return value;
        });
      }
      return null;
    });

    this.state.filteredLessons.sort((a, b) => {
      let value = 0;
      if (a.lessons.length > 0 && b.lessons > 0) {
        value = 0;
      } else {
        value =
          moment(a.lessons[0].lessonDate).date() -
          moment(b.lessons[0].lessonDate).date();
      }
      return value;
    });

    let cards = this.state.filteredLessons.map((stu) => {
      return <LessonCard key={stu.student._id} student={stu} />;
    });

    if (cards.length === 0) {
      cards = (
        <div>
          <p className="content no-content">No lessons to show</p>
        </div>
      );
    }

    return (
      <div>
        <Filter
          filter={this.applyFilter.bind(this)}
          lessons={this.state.lessons}
        />
        {cards}
      </div>
    );
  }
}

export default LessonsView;
