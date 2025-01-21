// src/pages/SuccessMessage.js
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessMessage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-green-50'>
      <div className='bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4 transform transition-all duration-500 hover:scale-105'>
        {/* Success Icon */}
        <div className='flex justify-center mb-6'>
          <svg
            className='w-20 h-20 text-green-500 animate-bounce'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 13l4 4L19 7'
            ></path>
          </svg>
        </div>

        {/* Title */}
        <h1 className='text-3xl font-bold text-green-600 mb-6'>
          Message Sent Successfully!
        </h1>

        {/* Message */}
        <p className='text-gray-700 mb-8 text-lg'>
          Thank you for contacting us. We will get back to you soon.
        </p>

        {/* Button to Return Home */}
        <Link
          to='/'
          className='inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-110'
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessMessage;