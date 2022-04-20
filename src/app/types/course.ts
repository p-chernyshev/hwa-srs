interface Course {
    id: number;
    name: string;
    description: string;
}

type NewCourse = Omit<Course, 'id'>;

interface ListCourse extends Course {
    due: number;
}

function isNewCourse(course: Course | NewCourse): course is NewCourse {
    return !('id' in course);
}

export {
    Course,
    NewCourse,
    ListCourse,
    isNewCourse,
};
