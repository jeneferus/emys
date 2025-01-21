import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='border-t bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left'>
          {/* Company Information */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Emy's Shop</h3>
            <p className='text-gray-600'>
              Discover the best products for every need. We are committed to quality and exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/about-us' className='text-gray-600 hover:text-primary-100'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/shipping-policy' className='text-gray-600 hover:text-primary-100'>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to='/contactUsPage' className='text-gray-600 hover:text-primary-100'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Follow Us</h3>
            <div className='flex justify-center md:justify-start gap-4 text-2xl'>
              <a href='' target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-primary-100'>
                <FaFacebook />
              </a>
              <a href='' target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-primary-100'>
                <FaInstagram />
              </a>
              <a href='' target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-primary-100'>
                <FaLinkedin />
              </a>
            </div>
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