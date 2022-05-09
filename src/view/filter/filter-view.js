//фильтры
import { createElement } from '../../render.js';
import createNewFilterTemplate from './filter-tpl.js';


export default class FilterView {
  getTemplate() {
    return createNewFilterTemplate();
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
