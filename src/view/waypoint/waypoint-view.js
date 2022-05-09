//точка маршпута (в списке)
import { createElement } from '../../render.js';
import createPointListTemplate from './waypoint-tpl.js';

export default class WaypointView {
  constructor(boardPoint) {
    this.boardPoint = boardPoint;
  }


  getTemplate() {
    return createPointListTemplate(this.boardPoint);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
