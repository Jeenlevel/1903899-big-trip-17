import DestinationModel from './model/destination-model.js';
import PointModel from './model/point-items-model.js';
import SortView from './view/sort/sort-view.js';
import FilterView from './view/filter/filter-view.js';
import { render } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const pageHeader = document.querySelector('.page-header');
const tripControls = pageHeader.querySelector('.trip-controls__filters');

const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

const pointsModel = new PointModel();
const destinationModel = new DestinationModel();
const boardPresenter = new BoardPresenter();

render(new SortView(), tripEvents);
render(new FilterView(), tripControls);

boardPresenter.init(tripEvents, pointsModel, destinationModel);
