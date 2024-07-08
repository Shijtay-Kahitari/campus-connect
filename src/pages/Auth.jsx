import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createAccount, login } from '../Redux/Slices/AuthSlice'; // Ensure these imports are correct

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signUppage, setSignUpPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match before submitting
    if (formData.password !== formData.repeatPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const data = {
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      password: formData.password,
    };

    try {
      setLoading(true);
      const response = await dispatch(createAccount(data)).unwrap();
      console.log("The response is", response);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: loginData.email,
      password: loginData.password,
    };

    try {
      setLoading(true);
      const response = await dispatch(login(data));
      console.log(response);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {signUppage ? (
        <form className="max-w-sm mx-auto pt-24" onSubmit={handleSubmit}>
          <div className="md:flex gap-2 mx-auto">
            <div className="mb-5">
              <label htmlFor="fname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
                First Name
              </label>
              <input
                type="text"
                id="fname"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Your first name"
                value={formData.fname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="lname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
                Last Name
              </label>
              <input
                type="text"
                id="lname"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Your last name"
                value={formData.lname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
              Your email
            </label>
            <input
              type="email"
                id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="name@flowbite.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="repeatPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
              Repeat password
            </label>
            <input
              type="password"
              id="repeatPassword"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              value={formData.repeatPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? 'Loading...' : 'Sign up'}
          </button>

          <p className='dark:text-white mt-4'>Have an account? <span onClick={() => setSignUpPage(false)} className="cursor-pointer text-blue-500">Login</span></p>
        </form>
      ) : (
        <form className="max-w-sm mx-auto pt-24" onSubmit={handleLoginSubmit}>
          <div className="mb-5">
            <label htmlFor="loginemail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="name@flowbite.com"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="loginpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

          <p className='dark:text-white mt-4'>Don't have an account? <span onClick={() => setSignUpPage(true)} className="cursor-pointer text-blue-500">Sign up</span></p>
        </form>
      )}
    </>
  );
};

export default Auth;
