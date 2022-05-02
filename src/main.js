import SortView from './view/sort-view';
import FilterView from './view/filter-view.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const pageHeader = document.querySelector('.page-header');
const tripControls = pageHeader.querySelector('.trip-controls__filters');

const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

const boardPresenter = new BoardPresenter();

render(new SortView(), tripEvents);
render(new FilterView(), tripControls);

boardPresenter.init(tripEvents);
