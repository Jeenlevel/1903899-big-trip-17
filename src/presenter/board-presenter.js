import { render } from '../render.js';
import CreationFormView from '../view/creation-form/creation-form-view.js';
import EditFormView from '../view/edit-form/edit-form-view.js';
import WaypointView from '../view/waypoint/waypoint-view.js';
import PointView from '../view/point/point-view.js';

export default class BoardPresenter {
  waypointViewComponent = new WaypointView();

  init = (boardContainer, pointsModel, destinationModel) => {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
    this.destinationModel = destinationModel;
    this.boardDestination = this.destinationModel.getDestinations();
    this.boardPoints = [...this.pointsModel.getPoints()];

    render(this.waypointViewComponent, this.boardContainer);
    render(new EditFormView(this.boardPoints[0], this.boardDestination[0]), this.waypointViewComponent.getElement());
    render(new CreationFormView(), this.waypointViewComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(this.boardPoints[i]), this.waypointViewComponent.getElement());
    }
  };
}
