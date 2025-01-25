import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='border-t bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Follow Us (Más a la izquierda) */}
          <div className='text-left'>
            <h3 className='text-lg font-semibold mb-4'>Follow Us</h3>
            <div className='flex gap-4'>
              <a
                href='https://www.facebook.com/profile.php?id=61571577703551'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-primary-500 transition duration-300'
              >
                <FaFacebook className='text-xl' />
              </a>
              <a
                href=''
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-primary-500 transition duration-300'
              >
                <FaInstagram className='text-xl' />
              </a>
              <a
                href=''
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-primary-500 transition duration-300'
              >
                <FaLinkedin className='text-xl' />
              </a>
            </div>
          </div>

          {/* Quick Links (Centrado) */}
          <div className='text-center'>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/about-us' className='text-gray-600 hover:text-primary-500 transition duration-300'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/shipping-policy' className='text-gray-600 hover:text-primary-500 transition duration-300'>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to='/contactUsPage' className='text-gray-600 hover:text-primary-500 transition duration-300'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Emy's Shop (Más a la derecha, texto más corto) */}
          <div className='text-right'>
            <h3 className='text-lg font-semibold mb-4'>Emy's Shop</h3>
            <p className='text-gray-600'>
              Quality products, exceptional service.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t mt-8 pt-4 text-center text-gray-600'>
          <p>© {new Date().getFullYear()} Emy's Shop. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;