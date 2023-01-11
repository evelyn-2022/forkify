import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeView from './views/addRecipeView';
import View from './views/View';
// import { reverse } from 'core-js/core/array';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Load recipe
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Update results view to mark active search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Render spinner
    resultsView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();

    // Clear input
    searchView.clearInput();

    // Load search results
    if (!query) return;
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render pagination
    paginationView.render(model.state.search);
  } catch (err) {}
};

const controlPagination = function (gotoPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // Render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarkInit = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner
    addRecipeView.renderSpinner();

    // Upload recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderSuccess();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close modal window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Auto refresh
    setTimeout(() => location.reload(), MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const controlDeleteRecipe = async function (id) {
  // Load delete
  await model.deleteRecipe(id);

  // Change Url
  let url = location.href.split('#')[0];
  location.href = url;

  // Remove bookmark
  model.removeBookmark(id);
  try {
  } catch (err) {}
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarkInit);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerDeleteRecipe(controlDeleteRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
