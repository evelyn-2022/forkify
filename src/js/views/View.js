import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   *Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false, create markup string instead of rendering to DOM
   * @returns {undefined | string} A markup string is returned if render=true
   * @this {Object} View instance
   */

  render(data, render = true) {
    if (!data || data.length < 1) {
      this.renderError();
      return;
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.#clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this.#clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElem.querySelectorAll('*'));

    newElements.forEach((newElem, i) => {
      const curElem = curElements[i];

      // Update changed text
      if (
        !newElem.isEqualNode(curElem) &&
        newElem.firstChild?.nodeValue.trim() !== '' // first child of an element is text
      ) {
        curElem.textContent = newElem.textContent;
      }

      // Update changed attributes
      if (!newElem.isEqualNode(curElem)) {
        Array.from(newElem.attributes).forEach(attr => {
          curElem.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.#clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._successMessage) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.#clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this._parentElem.innerHTML = '';
  }
}
