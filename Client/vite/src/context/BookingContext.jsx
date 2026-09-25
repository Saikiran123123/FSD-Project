/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();


export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // [{ seatId, row, number, category, price }]
  const [selectedFood, setSelectedFood] = useState([]); // [{ foodItemId, name, price, quantity, subtotal }]
  const [appliedOffer, setAppliedOffer] = useState(null); // { code, discount }
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [step, setStep] = useState(1); // 1: Seats, 2: Food, 3: Checkout, 4: Confirmed

  // Calculations
  const seatsTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const foodTotal = selectedFood.reduce((sum, f) => sum + f.price * f.quantity, 0);
  const convenienceFee = selectedSeats.length > 0 ? 35 : 0;
  const discountAmount = appliedOffer ? appliedOffer.discount : 0;
  const grandTotal = Math.max(0, seatsTotal + foodTotal + convenienceFee - discountAmount);

  const clearBooking = () => {
    setSelectedMovie(null);
    setSelectedTheatre(null);
    setSelectedShow(null);
    setSelectedSeats([]);
    setSelectedFood([]);
    setAppliedOffer(null);
    setHoldExpiresAt(null);
    setStep(1);
  };

  const addFoodItem = (item) => {
    setSelectedFood((prev) => {
      const existing = prev.find((f) => f.foodItemId === item._id);
      if (existing) {
        return prev.map((f) =>
          f.foodItemId === item._id
            ? { ...f, quantity: f.quantity + 1, subtotal: (f.quantity + 1) * f.price }
            : f
        );
      }
      return [
        ...prev,
        {
          foodItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          subtotal: item.price,
        },
      ];
    });
  };

  const removeFoodItem = (itemId) => {
    setSelectedFood((prev) => {
      const existing = prev.find((f) => f.foodItemId === itemId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((f) => f.foodItemId !== itemId);
      }
      return prev.map((f) =>
        f.foodItemId === itemId
          ? { ...f, quantity: f.quantity - 1, subtotal: (f.quantity - 1) * f.price }
          : f
      );
    });
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        selectedTheatre,
        setSelectedTheatre,
        selectedShow,
        setSelectedShow,
        selectedSeats,
        setSelectedSeats,
        selectedFood,
        setSelectedFood,
        appliedOffer,
        setAppliedOffer,
        holdExpiresAt,
        setHoldExpiresAt,
        step,
        setStep,
        seatsTotal,
        foodTotal,
        convenienceFee,
        discountAmount,
        grandTotal,
        addFoodItem,
        removeFoodItem,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
