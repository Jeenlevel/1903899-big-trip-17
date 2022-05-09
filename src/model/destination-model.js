import { createDestinations } from '../mock/destination-mock.js';

export default class DestinationModel {
  getDestinations = () => createDestinations();
}
