import mongoose, { Schema, Document } from 'mongoose';

interface IModule {
    moduleName: string;
    moduleDescription: string;
    videoUrl: string;
}

interface ICourse extends Document {
    author: string;
    courseName: string;
    description: string;
    modules: IModule[];
    price: number;
    trainerId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ModuleSchema: Schema = new Schema({
    moduleName: {
        type: String,
        required: true,
        trim: true,
    },
    moduleDescription: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
        trim: true,
    },
});

const CourseSchema: Schema = new Schema(
    {
        author: {
            type: String,
            required: true,
            trim: true,
        },
        courseName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        modules: [ModuleSchema],
        Price: {
            type: Number,
            required: true,
        },
        trainerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'trainerModel',
        },
        createdAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
