import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './View';
// import { reduceRight } from 'core-js/core/array';

class recipeView extends View {
  _parentElem = document.querySelector('.recipe');

  _overlay = document.querySelector('.overlay--delete-recipe');
  _window = document.querySelector('.delete-recipe-window');

  _errorMessage = 'We could not find that recipe. Please try another one!';
  _successMessage = '';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(e => {
      window.addEventListener(e, handler);
    });
  }

  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._parentElem.addEventListener('click', e => {
      const btn = e.target.closest('.btn--delete');
      if (!btn) return;
      this._toggleWindow.bind(this)();
    });
  }

  _addHandlerHideWindow() {
    this._window.addEventListener('click', e => {
      const btnNo = e.target.closest('.btn--no');
      const btnYes = e.target.closest('.btn--yes');
      if (!btnNo && !btnYes) return;
      this._toggleWindow.bind(this)();
    });

    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  addHandlerDeleteRecipe(handler) {
    this._window.addEventListener('click', e => {
      const btn = e.target.closest('.btn--yes');

      if (!btn) return;

      handler(this._data.id);
    });
  }

  addHandlerUpdateServings(handler) {
    this._parentElem.addEventListener('click', e => {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const goto = +btn.dataset.goto;
      if (goto < 1) return;

      handler(goto);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElem.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
        <figure class="recipe__fig">
          <img src=${this._data.image} alt=${
      this._data.title
    } class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href=${icons}#icon-clock></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings"  data-goto="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-goto="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
           <button class="btn--round btn--delete btn--outline ${
             this._data.key ? '' : 'hidden'
           }">
            <span>×</span>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

          ${this._data.ingredients
            .map(i => {
              return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                i.quantity ? new Fraction(i.quantity).toString() : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${i.unit}</span>
                ${i.description}
              </div>
            </li>`;
            })
            .join('')}
            
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href=${this._data.sourceUrl}
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }
}

export default new recipeView();
