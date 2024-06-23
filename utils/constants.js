

/**
 * JOB_STATUS object defines possible statuses a job can have.
 * @type {Object.<string, string>}
 * @property {string} PENDING - job that is still pending.
 * @property {string} INTERVIEW - job that is in the interview stage.
 * @property {string} DECLINED - job that has been declined.
 */
export const JOB_STATUS = {
    PENDING: 'pending',
    INTERVIEW: 'interview',
    DECLINED: 'declined',
};

/**
 * JOB_TYPE object defines possible types a job can be.
 * @type {Object.<string, string>}
 * @property {string} FULL_TIME - full-time job.
 * @property {string} PART_TIME - part-time job.
 * @property {string} INTERNSHIP - internship.
 */
export const JOB_TYPE = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    INTERNSHIP: 'internship',
};

/**
 * JOB_SORT_BY object defines possible ways jobs can be sorted.
 * @type {Object.<string, string>}
 * @property {string} NEWEST_FIRST - sorting jobs by newest first.
 * @property {string} OLDEST_FIRST - sorting jobs by oldest first.
 * @property {string} ASCENDING - sorting jobs in ascending order (A-Z).
 * @property {string} DESCENDING - sorting jobs in descending order (Z-A).
 */
export const JOB_SORT_BY = {
    NEWEST_FIRST: 'newest',
    OLDEST_FIRST: 'oldest',
    ASCENDING: 'a-z',
    DESCENDING: 'z-a',
};