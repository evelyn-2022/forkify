import View from './View';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElem = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElem.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;

    const prev = `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
        </button>`;
    const next = `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>`;
    const totalPages = `
        <span class="pagination__btn--mid">Page ${curPage} of ${numPages}</span>`;

    // First page, with other pages
    if (curPage === 1 && numPages > 1) {
      return totalPages + next;
    }

    // First page, no other pages
    if (curPage === 1 && numPages === 1) {
      return totalPages;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return prev + totalPages;
    }

    // Other pages
    return prev + totalPages + next;
  }
}

export default new paginationView();
