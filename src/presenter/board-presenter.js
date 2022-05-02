import CreateFormView from '../view/creation-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import {render} from '../render.js';
import WaypointView from '../view/waypoint-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
  waypointViewComponent = new WaypointView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(this.piontListComponent, this.boardContainer);
    render(new EditFormView(), this.piontListComponent.getElement());
    render(new CreateFormView(), this.piontListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.piontListComponent.getElement());
    }
  };
}
