interface Course {
    id: number;
    name: string;
    description: string;
    due: number;
}

type NewCourse = Omit<Course, 'id' | 'due'>;

export {
    Course,
    NewCourse,
};
