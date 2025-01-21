import React from 'react';
import ContactUsForm from '../components/ContactUsForm';
import { useSelector } from 'react-redux';

const ContactUsPage = () => {
  const userId = useSelector((state) => state.user._id); // Obtén el _id desde el estado de Redux
  console.log("userId :", userId);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold text-center mb-8'>Contact Us</h1>
      {userId ? (
        <ContactUsForm userId={userId} />
      ) : (
        <p className='text-center text-red-500'>
          You must be logged in to access the contact form.
        </p>
      )}
    </div>
  );
};

export default ContactUsPage;