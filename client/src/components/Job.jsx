// Libraries
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link, Form } from 'react-router-dom';
// Assets
import Wrapper from '../assets/wrappers/Job';
// Components
import JobInfo from './JobInfo';
// Extend dayjs with advancedFormat plugin
day.extend(advancedFormat);



// Job component NOT a global component => Only used in JobsContainer.jsx component
const Job = ({
     _id,
     position,
     company,
     jobLocation,
     jobType,
     createdAt,
     jobStatus,
}) => {
    const date = day(createdAt).format('MMM Do, YYYY');

    return (
        <Wrapper>
            <header>
                <div className='main-icon'>{company.charAt(0)}</div>
                <div className='info'>
                    <h5>{position}</h5>
                    <p>{company}</p>
                </div>
            </header>
            <div className='content'>
                <div className='content-center'>
                    <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
                    <JobInfo icon={<FaCalendarAlt />} text={date} />
                    <JobInfo icon={<FaBriefcase />} text={jobType} />
                    <div className={`status ${jobStatus}`}>{jobStatus}</div>
                </div>

                <footer className='actions'>
                    {/* Navigate to edit-job page and find job with this mongoDB '_id' */}
                    <Link to={`../edit-job/${_id}`} className='btn edit-btn'>
                        Edit
                    </Link>

                    {/* Delete job with this mongoDB '_id' */}
                    <Form method='post' action={`../delete-job/${_id}`}>
                        <button type='submit' className='btn delete-btn'>
                            Delete
                        </button>
                    </Form>
                </footer>
            </div>
        </Wrapper>
    );
};

export default Job
