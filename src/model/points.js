import Observable from '../framework/observable.js';
import { UpdateType } from '../consts.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(pointsApiService) {
    super();

    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      const offers = await this.#pointsApiService.offers;
      const destinations = await this.#pointsApiService.destinations;
      this.#points = points.map(this.#adaptToClient);
      this.#offers = offers.slice();
      this.#destinations = destinations.slice();
    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedWaypoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedWaypoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedWaypoint);
    } catch(err) {
      throw new Error('Can\'t update waypoint');
    }


  };

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newWaypoint = this.#adaptToClient(response);
      this.#points = [newWaypoint, ...this.#points];
      this._notify(updateType, newWaypoint);
    } catch(err) {
      throw new Error('Can\'t add waypoint');
    }
  };

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete waypoint');
    }
  };

  #adaptToClient = (point) => {
    const adaptedPoint = Object.assign({}, point, {
      basePrice: point.base_price,
      dateFrom: new Date(point.date_from),
      dateTo: new Date(point.date_to),
      isFavorite: point.is_favorite,
    });
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  };
}
