import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import myActions from '../store/sagas';

export const Page1 = () => {
  const counter = useSelector((state) => state.test.counter);
  const dispatch = useDispatch();
  const handlePlus = () => {
    dispatch(myActions.updateCounter({ counter: counter + 1 }));
  };
  return <div>
    Counter: {counter}
    <div>
      <button type="button" onClick={handlePlus}>Plus!</button>
    </div>
  </div>;
};
