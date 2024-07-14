import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useSelector((state) => state.auth);

    const navigate = useNavigate()

    useEffect(() => {
        if (!user?.token) {
            navigate('/auth');
        }
    }, [user, navigate]);
    return (
        <section>
            <Nav />
            <h1 className='text-[15rem] dark:text-white from-bold w-fit mx-auto mt-20'>काम करा रे </h1>

        </section>
    )
}

export default Home