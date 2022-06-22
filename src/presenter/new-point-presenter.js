import PointEditView from '../view/point-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../consts.js';
import dayjs from 'dayjs';
import { checkEsc } from '../utils/point.js';

const generateBlankWaypoint = () => ({
  basePrice: Number(),
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
  newPoint: true
});

export default class NewPointPresenter {
  #pointsContainer = null;
  #pointEditComponent = null;
  #changeData = null;
  #checkWaypointsCountCallback = null;

  constructor(pointsContainer, changeData) {
    this.#pointsContainer = pointsContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers , destinations) => {
    this.#checkWaypointsCountCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView(generateBlankWaypoint(), offers, destinations);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointsContainer.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#checkWaypointsCountCallback?.();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #handleFormSubmit = (waypoint) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      waypoint,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #onEscKeyDown = (evt) => {
    if (checkEsc(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
