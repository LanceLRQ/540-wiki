import { debounce } from 'lodash';
import React, { useEffect } from 'react';

export const BirthdayAppComponent = () => {
  useEffect(() => {
    let typeWords = '';
    const emitWords = 'URBBRGROUN';
    const cleanWords = debounce(() => {
      typeWords = '';
    }, 2000);
    const keyDownListener = (e) => {
      if (e.key.match(/^[a-zA-z]$/)) {
        typeWords += e.key;
        if (typeWords.toLowerCase() === emitWords.toLowerCase()) {
          // TODO callback()
          console.log('我是海皇！！');
        }
        cleanWords();
      }
    };
    document.addEventListener('keydown', keyDownListener);
    return () => {
      // cleanup
      document.removeEventListener('keydown', keyDownListener);
    };
  }, []);
  return <div>
    aaa
  </div>;
};

export default BirthdayAppComponent;
