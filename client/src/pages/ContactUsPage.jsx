import React from 'react';
import ContactUsForm from '../components/ContactUsForm';
import { useSelector } from 'react-redux';

// Hook personalizado para obtener el userId
const useUserId = () => {
  return useSelector((state) => state.user._id);
};

const ContactUsPage = () => {
  const userId = useUserId(); // Usar el hook personalizado

  return (
    <div className='container mx-auto p-4'>
      {/* Título de la página */}
      <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
        Contact Us
      </h1>

      {/* Mostrar el formulario o el mensaje de error */}
      {userId ? (
        <ContactUsForm userId={userId} />
      ) : (
        <div className='text-center'>
          <p className='text-red-500 font-semibold mb-4'>
            You must be logged in to access the contact form.
          </p>
          <p className='text-gray-600'>
            Please <a href='/login' className='text-blue-500 hover:underline'>log in</a> or{' '}
            <a href='/register' className='text-blue-500 hover:underline'>sign up</a> to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactUsPage;