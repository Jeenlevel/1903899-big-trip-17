//форма создания
import { createElement } from '../../render.js';
import creationNewFormTemplate from './creation-form-tpl.js';


export default class CreationFormView {
  getTemplate() {
    return creationNewFormTemplate();
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
