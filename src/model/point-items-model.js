import {generatePoint} from '../mock/point-mock.js';

export default class PointModel {
  points = Array.from( { length: 5 }, generatePoint);

  getPoints = () => this.points;
}
