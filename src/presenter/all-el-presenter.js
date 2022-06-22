import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { SortType, FilterType, UpdateType, UserAction, TimeLimit } from '../consts.js';
import { sortByDate, sortByPrice, sortByTime, filter } from '../utils/point.js';
import SortView from '../view/sort-view.js';
import MainContentView from '../view/main-content-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import TripInfoView from '../view/trip-info-view.js';

const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  #tripHeaderContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #addNewWaypointBtn = null;
  #sortingComponent = null;
  #noPointsComponent = null;
  #tripInfoComponent = null;
  #loadingComponent = new LoadingView();
  #currentSortType = null;
  #pointsContainer = new MainContentView();
  #pointPresenter = new Map ();
  #newPointPresenter = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor( tripHeaderContainer, pointsModel, filterModel) {
    this.#tripHeaderContainer = tripHeaderContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#currentSortType = SortType.DEFAULT;
    this.#newPointPresenter = new NewPointPresenter(this.#pointsContainer, this.#handleViewAction, this.#addNewWaypointBtn);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderTrip();
  };

  get actualPoints() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);
    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredPoints.sort(sortByDate);

      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);

      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
    }

    return filteredPoints;
  }

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#noPointsComponent !== null) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }

    this.#newPointPresenter.init(callback, this.#pointsModel.offers, this.#pointsModel.destinations);
  };

  #renderPoint = (waypoint) => {
    this.#currentSortType = SortType.DEFAULT;

    const pointPresenter = new PointPresenter(this.#pointsContainer.element, this.#handleViewAction, this.#handleModeChange);

    pointPresenter.init(waypoint, this.#pointsModel.offers, this.#pointsModel.destinations);
    this.#pointPresenter.set(waypoint.id, pointPresenter);
  };

  #renderNoPoints = () => {
    if (this.#noPointsComponent === null) {
      this.#noPointsComponent = new NoPointView();
    }

    render(this.#noPointsComponent, siteTripEventsElement);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, siteTripEventsElement);
  };

  #renderPointList = (points) => {
    points.forEach((waypoint) => this.#renderPoint(waypoint));
  };

  #renderPointsContainer = () => {
    render(this.#pointsContainer, siteTripEventsElement);
  };

  #renderSortView = () => {
    if (this.#sortingComponent !== null) {
      this.#sortingComponent = null;
    }

    this.#sortingComponent = new SortView(this.#currentSortType);

    render(this.#sortingComponent, siteTripEventsElement);
    this.#sortingComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
  };

  #renderTrip = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.actualPoints.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderSortView();
      this.#renderPointsContainer();
      this.#renderPointList(this.actualPoints);
      this.#renderTripInfo();
    }
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#tripInfoComponent);
    remove(this.#sortingComponent);
    remove(this.#noPointsComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderTripInfo = () => {
    this.#tripInfoComponent = new TripInfoView(this.#pointsModel.points, this.#pointsModel.offers);
    render(this.#tripInfoComponent, this.#tripHeaderContainer, RenderPosition.AFTERBEGIN);
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        break;
    }
  };

  #onSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;

    this.#clearTrip();
    this.#renderSortView();
    this.#renderPointsContainer();
    this.#renderPointList(this.actualPoints);
    this.#renderTripInfo();
  };
}
