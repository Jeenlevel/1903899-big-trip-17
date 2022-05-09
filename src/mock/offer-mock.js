import {getRandomInteger, getRandomArrayElement} from '../utils.js';


const TYPES_LIBRARY = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const OFFERS_TITLE = ['Upgrade to a business class', 'Add luggage', 'Switch to comfort class', 'Add meal', 'Choose seats', 'Travel by train', 'Choose the radio station'];

const generateOffer = () => ({
  title: getRandomArrayElement(OFFERS_TITLE),
  price: getRandomInteger(10, 500),
});

const createTypes = () => {
  const types = [];
  TYPES_LIBRARY.forEach((typeName) => {
    types.push({
      type: typeName,
      offers: new Array(getRandomInteger(0, 5)).fill().map(() => generateOffer()),
    });
  });
  return types;
};
export {createTypes};
