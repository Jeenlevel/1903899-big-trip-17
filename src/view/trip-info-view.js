import dayjs from 'dayjs';
import { DateFormat } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';

const getTripTitle = (points) => {
  switch (points.length) {
    case 1:
      return [points[0].destination.name];
    case 2:
      return [`${points[0].destination.name} &mdash; ${points[1].destination.name}`];
    case 3:
      return [`${points[0].destination.name} &mdash; ${points[1].destination.name} &mdash; ${points[2].destination.name}`];
    default:
      return [`${points[0].destination.name} &mdash; ... &mdash; ${points[points.length - 1].destination.name}`];
  }
};

const getTripDates = (points) => `${dayjs(points[0].dateFrom).format(DateFormat.DAY_MONTH)}&nbsp;&mdash;&nbsp${dayjs(points[points.length - 1].dateTo).format(DateFormat.DAY_MONTH)}`;

const getOffersCost = (points, offersData) => {
  const pointsOffersPrice = [];

  for(const waypoint of points) {
    const offerIndex = offersData.findIndex((item) => item.type === waypoint.type);
    const waypointOffers = offersData[offerIndex].offers;
    const targetOffers = waypointOffers.filter((item) => waypoint.offers.some((el) => item.id === el));
    targetOffers.forEach((item) => pointsOffersPrice.push(item.price));
  }

  const offersCost = pointsOffersPrice.reduce((acc, price) => acc + price, 0);
  return offersCost;
};

const getTripCost = (points, offers) => {
  const basePriceCosts = points.reduce((sum, waypoint) => sum + Number(waypoint.basePrice), 0);
  const offersCost = getOffersCost(points, offers);

  return basePriceCosts + offersCost;
};

const createTripInfoTemplate = (points, offers) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripTitle(points)}</h1>
      <p class="trip-info__dates">${getTripDates(points)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(points, offers)}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView {
  #points = null;
  #offers = null;

  constructor(points, offers) {
    super();
    this.#points = points;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#offers);
  }
}
