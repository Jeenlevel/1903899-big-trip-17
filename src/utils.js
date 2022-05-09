// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import minMax from 'dayjs/plugin/minMax.js';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(utc);
dayjs.extend(minMax);
dayjs.extend(duration);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (elements) => (elements[getRandomInteger(0, elements.length - 1)]);

const getRandomMultipleArrayElement = (elements) => {
  const randomArrayNumber = getRandomInteger(1, elements.length - 1);
  for (let i = elements.length - 1; i > 0; i--) {
    const randomSort = Math.floor(Math.random() * (i + 1));
    [elements[i], elements[randomSort]] = [elements[randomSort], elements[i]];
  }
  const array = elements.slice(0, randomArrayNumber);
  return array;
};

const getDurationDates = (dateStart, dateFinish) => {
  const diff = dateFinish.diff(dateStart);
  const daysCount = dayjs.duration(diff).format('DD');
  const hoursCount = dayjs.duration(diff).format('HH');
  const minutesCount = dayjs.duration(diff).format('mm');

  if (daysCount > 0) {
    return `${daysCount}D ${hoursCount}H ${minutesCount}M`;
  }
  if (hoursCount > 0) {
    return `${hoursCount}H ${minutesCount}M`;
  } else {
    return `${minutesCount}M`;
  }
};

const getTitle = (boardPoint) => {
  let pretextTitle = 'to';
  if (boardPoint.type.includes('sightseeing') || boardPoint.type.includes('restaurant')) {
    pretextTitle = 'in';
  }
  if (boardPoint.type.includes('check-in')) {
    pretextTitle = 'at';
  }
  return pretextTitle;
};

export {getRandomInteger, getRandomArrayElement, getRandomMultipleArrayElement, getDurationDates, getTitle};
