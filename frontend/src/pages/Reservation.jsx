import React from 'react';
import ReservationForm from '../components/ReservationForm';

const Reservation = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book a Reservation</h1>
      <ReservationForm />
    </div>
  );
};

export default Reservation;