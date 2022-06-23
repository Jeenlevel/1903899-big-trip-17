import AllElPresenter from './presenter/all-el-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import NewPointBtnView from './view/new-point-btn-view.js';
import PointsApiService from './api.js';
import { render } from './framework/render.js';
import { AUTHORIZATION, END_POINT } from './consts.js';

const tripHeaderContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');

const newWaypointBtnComponent = new NewPointBtnView();
const filterModel = new FilterModel();
const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterPresenter = new FilterPresenter(filtersContainer, filterModel, pointsModel);
const allElPresenter = new AllElPresenter( tripHeaderContainer, pointsModel, filterModel);

const handleWaypointCreateFormClose = () => {
  newWaypointBtnComponent.element.disabled = false;
};

const handleNewWaypointBtnClick = () => {
  allElPresenter.createPoint(handleWaypointCreateFormClose);
  newWaypointBtnComponent.element.disabled = true;
};

filterPresenter.init();
allElPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newWaypointBtnComponent, tripHeaderContainer);
    newWaypointBtnComponent.setNewPointBtnClickHandler(handleNewWaypointBtnClick);
  });


