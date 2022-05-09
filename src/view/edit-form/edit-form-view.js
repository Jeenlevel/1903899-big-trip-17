//форма редактирования
import { createElement } from '../../render.js';
import createNewEditFormTemplate from './edit-form-tpl.js';


export default class EditFormView {
  constructor(boardPoint, boardDestination){
    this.boardPoint = boardPoint;
    this.boardDestination = boardDestination;
  }

  getTemplate() {
    return createNewEditFormTemplate(this.boardPoint, this.boardDestination);
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
