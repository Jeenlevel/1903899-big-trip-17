import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {UpdateType} from '../consts.js';

export default class FilterPresenter {
  #filterComponent = null;
  #currentFilter = null;
  #filterContainer = null;
  #filterModel = null;
  #waypointsModel = null;

  constructor(filterContainer, filterModel, waypointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#currentFilter = this.#filterModel.filter;
    const waypoints = [...this.#waypointsModel.points];
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(waypoints, this._getFilter());
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent,this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#currentFilter === filterType) {
      return;
    }

    this.#currentFilter = filterType;

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  _getFilter() {
    return this.#filterModel.filter;
  }
}
