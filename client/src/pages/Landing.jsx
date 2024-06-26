//import styled from "styled-components";
import Wrapper from "../assets/wrappers/LandingPage.js";
import main from '../assets/images/main.svg'
import {Link} from "react-router-dom";
import {Logo} from "../components";




const Landing = () => {
    return (
        <Wrapper>
            <nav>
                <Logo />
            </nav>

            <div className="container page">
                <div className="info">
                    <h1>
                        job <span> tracking </span> app
                    </h1>
                    <p>
                        Navigating the job market is now easier with our Job Tracker application.
                        Tailored for job seekers, this tool helps you manage and track the status
                        of all your job applications in one place. From application dates to
                        interview schedules, Job Tracker keeps you updated and organized. Whether
                        you’re a fresh graduate exploring opportunities or a professional seeking
                        a career change, Job Tracker is your reliable partner in your job search
                        journey. Start your path to your dream job with us today!
                    </p>
                    <Link to='/register' className='btn register-link'>
                        Register
                    </Link>
                    <Link to='/login' className='btn'>
                        Login / Demo User
                    </Link>
                </div>
                <img src={main} alt='job hunt' className='img main-img'/>
            </div>

        </Wrapper>
    );
};


export default Landing

