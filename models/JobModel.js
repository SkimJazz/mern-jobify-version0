
// External imports and package dependencies
import mongoose from 'mongoose';

// Local imports
import {JOB_STATUS, JOB_TYPE} from "../utils/constants.js";


const jobSchema = new mongoose.Schema(
    {
        company: String,
        position: String,

        // Create a key as an object with type string and enum predefined values(Dropdown menu)
        jobStatus: {
            type: String,
            enum: Object.values(JOB_STATUS),
            default: JOB_STATUS.PENDING,
        },
        jobType: {
            type: String,
            enum: Object.values(JOB_TYPE),
            default: JOB_TYPE.FULL_TIME,
        },
        jobLocation: {
            type: String,
            default: 'my city',
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    {timestamps: true }
);

// By default, export the model with the schema attached using mongoose.model method
export default mongoose.model('Job', jobSchema);