import {createTypes} from './offers.js';
import {generateDestinations} from './destinations.js';
import {getRandomInteger, getRandomArrayElement} from '../utils.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import minMax from 'dayjs/plugin/minMax.js';
dayjs.extend(utc);
dayjs.extend(minMax);

const genearateDate = () => {
  const maxDaysGap = 30;
  const maxTimeGap = 10;
  const firstDayGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const secondDayGap = getRandomInteger(firstDayGap, maxDaysGap);
  return {
    dateFrom: dayjs.utc().add(firstDayGap, 'day').add(getRandomInteger(0, maxTimeGap), 'minute').add(getRandomInteger(0, maxTimeGap), 'hour'),
    dateTo: dayjs.utc().add(secondDayGap, 'day').add(getRandomInteger(0, maxTimeGap), 'minute').add(getRandomInteger(0, maxTimeGap), 'hour'),
  };
};

const generatePoint = () => {
  const offers = getRandomArrayElement(createTypes());
  return {
    basePrice: getRandomInteger(10, 1000),
    dateFrom: dayjs.min(dayjs(), genearateDate().dateFrom, genearateDate().dateTo),
    dateTo: dayjs.max(dayjs(), genearateDate().dateFrom, genearateDate().dateTo),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    destination: getRandomArrayElement(generateDestinations()).name,
    offers: offers.offers,
    type: offers.type,
  };
};

export const generatePoints = (count) => new Array(count).fill('').map(() => generatePoint());
