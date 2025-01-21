import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        About Emy's Shop
      </h1>

      {/* Sección de introducción */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Emy's Shop</h2>
        <p className="text-gray-700 mb-4">
          Hello and welcome to <strong>Emy's Shop</strong>, your one-stop destination for the best products tailored to every taste and occasion. We are committed to delivering excellence by thoroughly checking the quality of our goods and partnering only with reliable suppliers. Our mission is to ensure you receive nothing but the best.
        </p>
        <p className="text-gray-700 mb-4">
          At <strong>Emy's Shop</strong>, we believe that shopping is a right, not a luxury. That's why we strive to offer high-quality products at the most affordable prices, delivered to your doorstep no matter where you are.
        </p>
      </div>

      {/* Sección de nuestra misión */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          Our mission is simple: to provide you with an exceptional shopping experience. We aim to make your life easier by offering a wide range of products that cater to your needs, all while maintaining the highest standards of quality and customer service.
        </p>
        <p className="text-gray-700 mb-4">
          We are passionate about what we do and are constantly working to improve our services. Your satisfaction is our top priority, and we are here to ensure that every purchase you make is a delightful experience.
        </p>
      </div>

      {/* Sección de nuestros valores */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">
            <strong>Quality:</strong> We are committed to offering only the best products, rigorously tested for quality and durability.
          </li>
          <li className="mb-2">
            <strong>Customer Satisfaction:</strong> Your happiness is our success. We go the extra mile to ensure you are satisfied with every purchase.
          </li>
          <li className="mb-2">
            <strong>Affordability:</strong> We believe that everyone deserves access to high-quality products at reasonable prices.
          </li>
          <li className="mb-2">
            <strong>Innovation:</strong> We are always looking for new ways to improve and innovate, ensuring that we stay ahead of the curve.
          </li>
        </ul>
      </div>

      {/* Sección de nuestro equipo */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Team</h2>
        <p className="text-gray-700 mb-4">
          Behind <strong>Emy's Shop</strong> is a dedicated team of professionals who are passionate about what they do. From our customer service representatives to our logistics experts, every member of our team plays a crucial role in ensuring that you have the best shopping experience possible.
        </p>
        <p className="text-gray-700 mb-4">
          We are a diverse group of individuals united by a common goal: to make your shopping experience seamless, enjoyable, and memorable.
        </p>
      </div>

      {/* Sección de contacto */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Get in Touch</h2>
        <p className="text-gray-700 mb-4">
          We would love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out to us. Our team is always ready to assist you.
        </p>
        <p className="text-gray-700 mb-4">
          You can contact us via email at <strong>support@emysshop.com</strong> .
        </p>
      </div>
    </div>
  );
};

export default AboutUs;