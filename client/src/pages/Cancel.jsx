import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className='m-2 w-full max-w-md bg-red-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-red-800 font-bold text-lg text-center'>Order Canceled</p>
      <p className='text-red-800 text-sm text-center'>
        We're sorry to see you go! 😢
        <br />
        Don't worry, there are plenty of amazing products waiting for you.
      </p>

      <Link
        to="/" // Home page route
        className="border border-red-900 text-red-900 hover:bg-red-900 hover:text-white transition-all px-4 py-1"
      >
        Go To Home
      </Link>
    </div>
  );
};

export default Cancel;