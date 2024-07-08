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

        </section>
    )
}

export default Home