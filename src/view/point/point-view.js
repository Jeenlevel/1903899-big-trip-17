//точка маршрута
import { createElement } from '../../render.js';
import createPointTemplate from './point-tpl.js';

export default class PointView {
  getTemplate() {
    return createPointTemplate();
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
