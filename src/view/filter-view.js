import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../consts.js';

const getPastPoints = (points) => points.some((point) => point.dateTo < dayjs()) ? '' : 'disabled';

const getFuturePoints = (points) => points.some((point) => point.dateFrom >= dayjs()) ? '' : 'disabled';

const createNewFilterTemplate = (points, currentFilterType = FilterType.EVERYTHING) => {
  const isPastDisabled = getPastPoints(points);
  const isFutureDisabled = getFuturePoints(points);

  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${currentFilterType === FilterType.EVERYTHING ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${currentFilterType === FilterType.FUTURE ? 'checked' : ''} ${isFutureDisabled}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${currentFilterType === FilterType.PAST ? 'checked' : ''} ${isPastDisabled}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #currentFilterType = null;
  #points = null;

  constructor(points, currentFilterType) {
    super();

    this.#currentFilterType = currentFilterType;
    this.#points = points;
  }

  get template() {
    return createNewFilterTemplate(this.#points, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      evt.preventDefault();

      this._callback.filterTypeChange(evt.target.value);
    }
  };
}
