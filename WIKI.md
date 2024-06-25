
## Data flow based on the provided code breakdown: (For Data Flow Diagram)

1. **User Registration (`authRouter.js` -> `authController.js` -> `UserModel.js` -> `passwordUtils.js`):**
   - The user sends a POST request to the `/api/v0/auth/register` endpoint with their details (username, password, etc.).
   - The `register` function in `authController.js` is executed. It checks if this is the first account being created.
   - The user's password is hashed using the `hashPassword` function from `passwordUtils.js`.
   - A new user is created in the database with the provided details using the `User` model from `UserModel.js`.

2. **User Login (`authRouter.js` -> `authController.js` -> `UserModel.js` -> `passwordUtils.js` -> `tokenUtils.js`):**
   - The user sends a POST request to the `/api/v0/auth/login` endpoint with their email and password.
   - The `login` function in `authController.js` is executed. It checks if the user exists in the database using the `User` model from `UserModel.js`.
   - If the user exists, it checks if the provided password is correct using the `comparePassword` function from `passwordUtils.js`.
   - If the password is correct, a JWT token is created using the `createJWT` function from `tokenUtils.js`.

3. **User Authentication (`authMiddleware.js` -> `tokenUtils.js`):**
   - For certain routes, the `authenticateUser` middleware function in `authMiddleware.js` is executed before the route handler.
   - It checks if the 'monster' cookie exists in the request.
   - If the cookie exists, it verifies the JWT token using the `verifyJWT` function from `tokenUtils.js`.

4. **Job Operations (`jobRouter.js` -> `jobController.js` -> `JobModel.js`):**
   - The user can perform various operations on jobs (get all jobs, get a job by id, create a new job, update a job by id, delete a job by id) by sending requests to the respective endpoints.
   - The corresponding function in `jobController.js` is executed for each operation.
   - These operations interact with the `Job` model from `JobModel.js` to perform the necessary database operations.

5. **Error Handling (`errorHandlerMiddleware.js`):**
   - If any error occurs during the execution of the above operations, the `errorHandlerMiddleware` function is executed to handle the error and send an appropriate response to the client.

6. **Validation (`validationMiddleware.js`):**
   - Before executing certain operations (like user registration, user login, job creation, job update), the input data is validated using the appropriate validation middleware function from `validationMiddleware.js`.

   

## Importing and Exporting in Node.js

The `import` and `export` syntax in Node.js is used to import and export
variables, functions, classes, etc. between files. This is useful for
organizing code into separate files and reusing code across multiple files.

In this project, the `import` and `export` syntax is used in the `test-default.js`,
`test-named.js`, and `server.js` files. The `test-default.js` and `test-named.js`
files are used to export variables, while the `server.js` file is used to import
those variables.


The `"type": "module"` in the `package.json` file has an impact on how the
variables in `test-default.js`, `test-named.js`, and `server.js` files function, 
specifically in terms of how they are imported and exported.

```json
{
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}

```


In Node.js, there are two major module systems: **CommonJS** and **ES (ES6)** Modules. 
CommonJS is the older, traditional module system used in Node.js, while ES Modules 
is the newer system that aligns with the standard JavaScript module system used 
in modern browsers.

By setting `"type": "module"` in the `package.json`, you're telling Node.js to 
treat `.js` files in this project as ES Modules. This affects the syntax use to
import and export variables, functions, classes, etc.

The following module system, ES (ES6) Module shows the syntax used in this project:

```javascript
// ES Module import syntax
import {value} from './test-named.js';
import randomValue from './test-default.js';
```

If we want to use CommonJS, the syntax would look like the following:

```javascript
// CommonJS import syntax
const {value} = require('./test-named.js');
const randomValue = require('./test-default.js');
```

Therefore, the `"type": "module"` in the `package.json` is enabling us to 
use the `import`/`export` syntax in the `.js` files. Without it, Node.js 
would expect us to use `require` and `module.exports` instead.

## Constants and JobModel Schema

Constants and how do they relate to the JobModel schema in the JobModel.js file?

The constants.js file defines several JavaScript objects that represent different
sets of predefined values. These objects are used in the JobModel.js file to define
the possible values for certain fields in the Job schema.  

Here's a breakdown of the constants:  

1. **JOB_STATUS:** This object defines the possible statuses a job can have. It includes
`pending`, `interview`, and `declined`.  
2. **JOB_TYPE:** This object defines the possible types a job can be. It includes `full-time`,
`part-time`, and `internship`.  
3. **JOB_SORT_BY:** This object defines the possible ways jobs can be sorted. It includes 
`newest`, `oldest`, `a-z`, and `z-a`.

```js
export const JOB_STATUS = {
PENDING: 'pending',
INTERVIEW: 'interview',
DECLINED: 'declined',
};

export const JOB_TYPE = {
FULL_TIME: 'full-time',
PART_TIME: 'part-time',
INTERNSHIP: 'internship',
};

export const JOB_SORT_BY = {
NEWEST_FIRST: 'newest',
OLDEST_FIRST: 'oldest',
ASCENDING: 'a-z',
DESCENDING: 'z-a',
};
```

In the `JobModel.js` file, these constants are imported and used in the definition of 
the Job schema: 

```js
// Create a new schema for the job model
const jobSchema = new mongoose.Schema(
    {
        company: String,
        position: String,
        
```       

1. **jobStatus:** This field in the Job schema uses the JOB_STATUS constant to define its
   possible values. The enum option in Mongoose is used to restrict the values of the
   jobStatus field to the values defined in JOB_STATUS. The default option is used to
   set the default value of the jobStatus field to 'pending'.

```js
        // Create a key as an object with type string and enum predefined values(Dropdown menu)
        jobStatus: {
            type: String,
            enum: Object.values(JOB_STATUS),
            default: JOB_STATUS.PENDING,
        },
```

2. **jobType:** This field in the Job schema uses the JOB_TYPE constant to define its
   possible values. The enum option in Mongoose is used to restrict the values of the
   jobType field to the values defined in JOB_TYPE. The default option is used to set
   the default value of the jobType field to 'full-time'.


```js
        jobType: {
            type: String,
            enum: Object.values(JOB_TYPE),
            default: JOB_TYPE.FULL_TIME,
        },
        jobLocation: {
            type: String,
            default: 'my city',
        },
    },
    {timestamps: true }
);
```

The enum option in Mongoose is a form of data validation that ensures the value of a field
matches one of the predefined values. This helps maintain data integrity by preventing 
invalid data from being saved in the database.  

in the constants.js file are used to define the possible values for certain fields
in the Job schema. They are imported into the JobModel.js file and used in the 
definition of the Job schema to restrict the values of these fields.

#### Build Front-End on Render

The selected code is a part of the `package.json` file in a Node.js project. 
This section, labeled as `"scripts"`, contains a set of predefined commands that can
be run using the npm (Node Package Manager) command-line tool. These scripts are used
to automate repetitive tasks such as starting the server, running the client, or setting
up the project.

The `"setup-project"` script is used to install the project dependencies. It runs `npm i` 
to install the server-side dependencies, and then `cd client && npm i` to navigate to the
client directory and install the client-side dependencies.

```json
"setup-project": "npm i && cd client && npm i",
```

The `"setup-production-app"` script is similar to the `"setup-project"` script, but it also
builds the client-side application for production using `npm run build`.

```json
"setup-production-app": "npm i && cd client && npm i && npm run build",
```

The `"server"` script uses `nodemon` to start the server. Nodemon is a utility that 
automatically restarts the server when file changes are detected, making it useful during
development.

```json
"server": "nodemon server",
```

The `"client"` script navigates to the client directory and starts the client-side 
application in development mode with `npm run dev`.

```json
"client": "cd client && npm run dev",
```

Finally, the `"dev"` script uses `concurrently` to run the `"server"` and`"client"` 
scripts at the same time. The `--kill-others-on-fail` option ensures that if one 
script fails, the other is also terminated.

```json
"dev": "concurrently --kill-others-on-fail \" npm run server\" \" npm run client\""
```

These scripts provide a convenient way to manage the project's tasks, and they can 
be run from the command line using `npm run <script-name>`.


#### Cloning and Installing project on local PC


Sure, here are the steps to install the project on your personal PC:

1. **Clone the Repository**: First, you need to clone the repository from GitHub
to your local machine. Open your terminal and navigate to the directory where you
want to clone the repository. Then, use the following command:

```sh
git clone git@github.com:SkimJazz/mern-jobify-version0.git
```

2. **Navigate to the Project Directory**: Once the repository is cloned, navigate
to the project directory using the following command:

```sh
cd mern-jobify-v0
```

3. **Install Dependencies**: Now, you need to install the project dependencies.
The `setup-project` script in the `package.json` file installs both the server-side
and client-side dependencies. Run the following command:

```sh
npm run setup-project
```

4. **Start the Server and Client**: After the dependencies are installed, you can
start the server and client. The `dev` script in the `package.json` file starts both
the server and client concurrently. Run the following command:

```sh
npm run dev
```

Now, both the server and client should be running on your local machine. The server 
will restart automatically whenever there are changes thanks to `nodemon`, and the 
client will also update in real time as you make changes to the code.
