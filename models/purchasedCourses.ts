import mongoose, { Schema, Document } from 'mongoose';

interface IEnrolledModule extends Document {
    moduleId: mongoose.Schema.Types.ObjectId;
    completed: boolean;
}

interface IEnrolledCourse extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    courseId: mongoose.Schema.Types.ObjectId;
    enrolledAt: Date;
    completed: boolean;
    modules: IEnrolledModule[];
    createdAt: Date;
    updatedAt: Date;
}

const EnrolledModuleSchema: Schema = new Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Module',
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const EnrolledCourseSchema: Schema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        modules: [EnrolledModuleSchema],
    },
    {
        timestamps: true,
    }
);

const EnrolledCourse = mongoose.model<IEnrolledCourse>('EnrolledCourse', EnrolledCourseSchema);

export default EnrolledCourse;
