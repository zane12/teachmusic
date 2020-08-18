import React from "react";
import AddStudentCard from "../Cards/AddStudentCard";
import StudentCard from "../Cards/StudentCard";

class StudentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      refresh: true,
      teacherToken: this.props.teacherToken,
      teacher: this.props.teacher,
      teacherId: this.props.teacherId,
    };
  }

  componentDidMount() {
    this.refreshContent();
  }

  async refreshContent() {
    if (this.state.refresh) {
      await fetch("/student", {
        headers: { Authorization: "Bearer " + this.state.teacherToken },
      })
        .then((res, req) => {
          const response = res.json();

          return response;
        })
        .then((response) => {
          return this.setState({ students: response });
        })
        .catch((e) => {
          console.log(e);
        });

      this.setState({ refresh: false });
    }
  }

  studentCardHandler(students) {
    const studentContent = students.map((student) => {
      return (
        <StudentCard
          refresh={() => {
            this.setState({ refresh: true });
            this.refreshContent();
          }}
          student={student}
          key={student._id}
        />
      );
    });

    return studentContent;
  }

  render() {
    if (this.state.refresh) {
      this.refreshContent();
    }
    return (
      <div>
        {this.studentCardHandler(this.state.students)}
        <AddStudentCard
          refresh={() => {
            this.setState({ refresh: true });
            this.refreshContent();
          }}
        />
      </div>
    );
  }
}

export default StudentView;
