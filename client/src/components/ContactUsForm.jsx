import React, { useState } from 'react';
import Axios from '../utils/Axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ContactUsForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Axios.post('/api/contactus', {
        ...formData,
        userId,
      });

      if (response.data.success) {
        toast.success('Your message has been sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        navigate('/SuccessMessage'); // Redirigir a la página de éxito
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl'>
      <form onSubmit={handleSubmit} className='space-y-1'> {/* Aumenta el espacio entre los campos */}
        {/* Name Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Name
          </label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            placeholder='Enter your name'
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Email
          </label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            placeholder='Enter your email'
            required
          />
        </div>

        {/* Subject Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Subject
          </label>
          <input
            type='text'
            name='subject'
            value={formData.subject}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            placeholder='Enter the subject'
            required
          />
        </div>

        {/* Message Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Message
          </label>
          <textarea
            name='message'
            value={formData.message}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            rows='6'
            placeholder='Enter your message'
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className='text-right'>
          <button
            type='submit'
            disabled={loading}
            className='px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105'
          >
            {loading ? (
              <div className='flex items-center'>
                <svg
                  className='animate-spin h-5 w-5 mr-3 text-white'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUsForm;
