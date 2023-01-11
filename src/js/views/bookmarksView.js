import View from './View';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElem = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet.';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
