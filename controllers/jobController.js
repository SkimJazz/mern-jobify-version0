// Library imports
import mongoose from 'mongoose';
import day from 'dayjs';
// import {nanoid} from 'nanoid';

// Local imports
import Job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';


// Array of jobs
// let jobs = [
//     { id: nanoid(), company: 'tablogs', position: 'full-stack' },
//     { id: nanoid(), company: 'commbank', position: 'back-end' },
// ];


// GET ALL JOBS
export const getAllJobs = async (req, res) => {

    // Express.js route handler -> extract search property from req.query object
    const { search, jobStatus, jobType, sortJob } = req.query;

    // Query object to filter jobs by createdBy field
    const queryObject = {
        createdBy: req.user.userId
    };

    // If search query is present, add search condition to queryObject
    if (search) {
        queryObject.$or = [
            { position: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ];
    }

    // If jobStatus exists and is not equal to 'all', only then will it be added to the queryObject
    if (jobStatus && jobStatus !== 'all') {
        queryObject.jobStatus = jobStatus;
    }
    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType;
    }

    // ------------------ Sorting order of Jobs ------------------ //

    const sortOptions = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'position',
        'z-a': '-position',
    };
    const sortKey = sortOptions[sortJob] || sortOptions.newest;


    // ----------------- Pagination of Jobs ----------------- //

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Calc number of documents to skip => skip 0 jobs
    const skip = (page - 1) * limit;

    // Query MongoDB database using Mongoose's find method
    const jobs = await Job.find(queryObject)
        .sort(sortKey)  // related to sorting order of jobs
        .skip(skip)
        .limit(limit);


    const totalJobs = await Job.countDocuments(queryObject);
    // Math.ceil() rounds up to nearest whole number
    const numOfPages = Math.ceil(totalJobs / limit);


    res
        .status(StatusCodes.OK)
        .json({ totalJobs, numOfPages, currentPage: page, jobs });
};


// GET JOB BY ID
/**
 * This function is an Express.js route handler for GET requests to
 * '/api/v0/jobs/:id'. It retrieves a job by its ID from the MongoDB
 * database using Mongoose's `findById` method.
 *
 * The error thrown in the server-side code will not be directly passed
 * to the client. Instead, it will be logged in the server's terminal.
 * However, the server can send a response to the client
 * indicating that an error occurred. This is typically done by sending
 * an HTTP status code and a message. In the case of the NotFoundError,
 * the server would respond with a 404 status code and a custom error
 * message. This allows the client to handle the error appropriately,
 * such as displaying a user-friendly error message or redirecting to
 * an error page.
 *
 * @async
 * @function getJobById
 * @param {Object} req - The Express request object, containing the job ID in `req.params.id`.
 * @param {Object} res - The Express response object.
 * @throws {NotFoundError} When no job with the specified ID is found in the database.
 * @returns {Object} The job object if found, and sends it as a JSON response with a 200 status code.
 *
 * @example
 * // GET request to '/api/v1/jobs/1234'
 * getJobById(req, res);
 */
export const getJobById = async (req, res) => {
    // const { id } = req.params;  // Destructure 'id' from the request parameters in URL
    //  Works same as findByIdAndDelete(req.params.id)
    const job = await Job.findById(req.params.id);
    res.status(StatusCodes.OK).json({ job });
};


// CREATE NEW JOB
// export const createNewJob = async (req, res) => {
//     // Destructure 'company' and 'position' from the request body
//     const { company, position } = req.body;
//     // Asynchronous function to create new job using Job model =>use 'await'
//     const job = await Job.create({ company, position });
//     res.status(StatusCodes.CREATED).json({ msg:'New job added', job });
// };

export const createNewJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};


// UPDATE JOB BY ID
export const updateJobById = async (req, res) => {
    // const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob });
};


// DELETE JOB BY ID
export const deleteJobById = async (req, res) => {
    // const { id } = req.params;
    const removedJob = await Job.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob });
};

// Hard coded stats component -> Will be replaced with real data (Dynamic)
export const showStats = async (req, res) => {

    let stats = await Job.aggregate([

        /**
         * MongoDB aggregation pipeline.
         *
         * The pipeline is an array of stages, where each stage transforms the
         * documents as they pass through the pipeline.
         *
         * @see @link https://docs.mongodb.com/manual/core/aggregation-pipeline/|MongoDB Aggregation Pipeline
         *
         * The $match stage filters the documents to pass only the documents that
         * match the specified condition(s) to the next pipeline stage. Here, it
         * filters the documents where 'createdBy' field matches the ObjectId of
         * the logged in user.
         *
         * The $group stage groups the documents by some specified expression and
         * outputs to the next stage a document for each distinct grouping. Here, it
         * groups the documents by 'jobStatus' field and for each distinct group, it
         * counts the number of documents.
         *
         * { "string": { "string": new "ObjectId class instance"("string") } }
         */
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, // Stage 1
        { $group: { _id: '$jobStatus', count: { $sum: 1 } } }, // Stage 2

    ]);
    // Show stats in the console
    // console.log(stats);

    // Use the 'reduce' method to turn the jobs array into an object
    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc;
    }, {});

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    };

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
    ]);

    // const defaultStats = {
    //     pending: 22,
    //     interview: 11,
    //     declined: 4,
    // };
    // let monthlyApplications = [
    //     {
    //         date: 'May 23',
    //         count: 12,
    //     },
    //     {
    //         date: 'Jun 23',
    //         count: 9,
    //     },
    //     {
    //         date: 'Jul 23',
    //         count: 3,
    //     },
    // ];

    monthlyApplications = monthlyApplications
        .map((item) => {
            const { _id: { year, month }, count, } = item;

            // .month() is zero-based => subtract 1 from 12 months
            const date = day()
                .month(month - 1)
                .year(year)
                .format('MMM YY');
            return { date, count };
        }) // Run reverse() on .map() to show the latest month at the end of the chart
        .reverse();


    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};