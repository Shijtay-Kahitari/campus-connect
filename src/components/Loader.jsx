import React from 'react'
import './Loader.css'

const Loader = ({ message }) => {
    return (
        <div className='w-full h-screen flex items-center justify-center flex-col gap-8'>
            <div className='loader'></div>
            <h1 className='text-2xl text-gray-600'>{message} </h1>
        </div>
    )
}

export default Loader

