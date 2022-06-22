import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  updatePoint = (point) => this.#sendRequest(
    `points/${point.id}`,
    Method.PUT,
    JSON.stringify(this.#adaptToServer(point)),
    new Headers({'Content-Type': 'application/json'}),
  );

  addPoint = (point) => this.#sendRequest(
    'points',
    Method.POST,
    JSON.stringify(this.#adaptToServer(point)),
    new Headers({'Content-Type': 'application/json'}),
  );

  deletePoint = (point) => this.#sendRequest(
    `points/${point.id}`,
    Method.DELETE,
  );

  #sendRequest = async (url, method, body, headers) => {
    const response = await this._load({
      url: url,
      method: method,
      body: body,
      headers: headers,
    });

    return await ApiService.parseResponse(response).catch(() => 'OK');
  };

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'base_price': Number(point.basePrice),
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };
}

