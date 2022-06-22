import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { UserAction, UpdateType } from '../consts.js';
import { checkEsc } from '../utils/point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #changeData = null;
  #changeMode = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor(pointsContainer, changeData, changeMode) {
    this.#pointsContainer = pointsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offers, destinations) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent  = new PointView(point, offers);
    this.#pointEditComponent = new PointEditView(point, offers, destinations);

    this.#pointComponent.setRollupBtnClickHandler(this.#replacePointToForm);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#pointEditComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown',this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #onEscKeyDown = (evt) => {
    if (checkEsc(evt)) {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this.#point,
        {
          isFavorite: !this.#point.isFavorite
        }
      )
    );
  };

  #handleFormSubmit = (point) => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #handleEditClick = () => {
    this.resetView();
  };
}
