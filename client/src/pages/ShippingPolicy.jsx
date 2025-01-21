import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Shipping Policy</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Section 1: Order Processing Time */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">I JUST PLACED AN ORDER, WHEN WILL IT SHIP?</h2>
          <p className="text-gray-600 leading-relaxed">
            Please allow <strong className="text-gray-800">3 - 7 business days</strong> of processing and production time for your order to ship out.
          </p>
        </div>

        {/* Section 2: Shipping Time */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">HOW LONG IS THE SHIPPING TIME?</h2>
          <p className="text-gray-600 leading-relaxed">
            • Average time: <strong className="text-gray-800">2 – 5 business days</strong>
          </p>
          <p className="text-gray-600 mt-2 leading-relaxed">
            There are circumstances that are out of control (natural disasters, holidays, weather, etc.) that may cause shipping delays. While most packages will arrive on time, there may be circumstances and delays that our carriers may experience. For this reason, we do not guarantee the exact delivery time; the delivery issue is the responsibility of the shipping company.
          </p>
        </div>

        {/* Section 3: Order Cancellation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">CAN I CANCEL MY ORDER?</h2>
          <p className="text-gray-600 leading-relaxed">
            You are able to cancel your order with no penalty! You must cancel your order within <strong className="text-gray-800">24 hours</strong> after creating it for the cancellation to be applied. If the item has already shipped, all you need to do is send us an email with the subject line <strong className="text-gray-800">"CANCEL"</strong>.
          </p>
        </div>

        {/* Section 4: Incorrect Address */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">I HAVE ENTERED AN INCORRECT ADDRESS!</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have misspelled or auto-filled your address incorrectly, simply reply to your order confirmation email and provide us with the correct information. Notify us immediately via email. If the address is wrong, we can correct this within <strong className="text-gray-800">24 hours</strong>.
          </p>
        </div>

        {/* Section 5: Damaged Items */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">MY ITEM ARRIVED DAMAGED</h2>
          <p className="text-gray-600 leading-relaxed">
            We ship every item with extra padding. Despite this, our customers report that around <strong className="text-gray-800">1 in 1000</strong> products arrives damaged due to mail service mistreatment.
          </p>
          <p className="text-gray-600 mt-2 leading-relaxed">
            If this happens to you, please contact us with:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
            <li>Your order number.</li>
            <li>A picture of the damaged product.</li>
          </ul>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Once received, we'll be happy to send out a replacement free of charge.
          </p>
        </div>

        {/* Section 6: Unanswered Questions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">I HAVE A QUESTION THAT WASN'T ANSWERED, CAN YOU PLEASE HELP?</h2>
          <p className="text-gray-600 leading-relaxed">
            If we still haven't managed to answer your question, please feel free to contact us, and we will do our best to reply within <strong className="text-gray-800">24 hours</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;