import React from "react";

class LessonsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teacher: this.props.teacher,
      teacherId: this.props.teacherId,
      teacherToken: this.props.teacherToken,
      lessons: [],
    };
  }

  componentDidMount() {
    this.generateLessonCards();
  }

  async generateLessonCards() {
    const lessons = [];
    await fetch("/lessons", {
      headers: { Authorization: "Bearer " + this.state.teacherToken },
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        lessons.push(response.lesson);
        this.setState({ lessons });
      });
  }

  render() {
    return this.state.lessons.map((stu) => {
      console.log(stu);
      return (
        <div key={stu} className="content">
          {stu}
        </div>
      );
    });
  }
}

export default LessonsView;
