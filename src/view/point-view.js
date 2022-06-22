import AbstractView from '../framework/view/abstract-view.js';
import { getTitle } from '../utils';
import { humanizeEventDate, humanizeDataSetEventDate, humanizeDataSetEventTime, humanizeDateTime, getTimeDifference } from '../utils/point.js';

const getOffersTemplate = (offers, type, point) => {
  const offersByType = offers.filter((offer) => offer.type === type)[0].offers;
  const offersByPoint = offersByType.filter((item) => point.offers.indexOf(item.id) > 0);

  return offersByPoint.map(({title, price}) => `<span class="event__offer-title">${title}</span>
   &plus;&euro;&nbsp;
   <span class="event__offer-price">${price}</span>
  </li>`).join('');
};

const createPointTemplate = (point, allOffers) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    isFavorite,
    offers,
    type
  } = point;

  const dataSetEventDate = (dateFrom !== null) ? humanizeDataSetEventDate(dateFrom) : '';
  const eventDate = (dateFrom !== null) ? humanizeEventDate(dateFrom) : '';
  const startDataSetEventTime = (dateFrom !== null) ? humanizeDataSetEventTime(dateFrom) : '';
  const startDateTime = (dateFrom !== null) ? humanizeDateTime(dateFrom) : '';
  const endDDataSetEventTime = (dateTo !== null) ? humanizeDataSetEventTime(dateTo) : '';
  const endDateTime = (dateTo !== null) ? humanizeDateTime(dateTo) : '';
  const interval = (dateFrom !== null && dateTo !== null) ? getTimeDifference(dateFrom, dateTo) : '';

  return (
    `<li class="trip-events__item">
       <div class="event">
         <time class="event__date" datetime="${dataSetEventDate}">${eventDate}</time>
         <div class="event__type">
           <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
         </div>
         <h4 class="event__title">${type} ${getTitle(point)} ${destination.name}</h4>
         <div class="event__schedule">
           <p class="event__time">
             <time class="event__start-time" datetime="${startDataSetEventTime}">${startDateTime}</time>
             &mdash;
             <time class="event__end-time" datetime="${endDDataSetEventTime}">${endDateTime}</time>
           </p>
           <p class="event__duration">${interval}</p>
         </div>
         <p class="event__price">
           &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
         </p>
         ${(offers !== []) ?
      `<h4 class="visually-hidden">Offers:</h4>
         <ul class="event__selected-offers">
         ${getOffersTemplate(allOffers, type, point)}
         </ul>` : ''}
         <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}"  type="button">
           <span class="visually-hidden">Add to favorite</span>
           <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
             <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
           </svg>
         </button>
         <button class="event__rollup-btn" type="button">
           <span class="visually-hidden">Open event</span>
         </button>
       </div>
     </li>`
  );
};

export default class PointView extends AbstractView  {
  #point = null;
  #offers = null;

  constructor (point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers);
  }

  setRollupBtnClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
