import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

///
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  const id = window.location.hash;
  if (!id) return;
  try {
    recipeView.renderSpinner();
    //0) Update Search Results
    resultsView.update(model.getSearchResultsPage());
    //1) Update bookmarks
    bookmarksView.update(model.state.bookmarks);
    //2) loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    console.log(recipe);
    //3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err.message);
    recipeView.renderError();
    // alert(err.message);
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();

    // 1)Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render intial pagiantion buttons
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError(error);
  }
};

const contolPagination = function (goToPage) {
  // 3) Render  new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render new pagiantion buttons
  // paginationView.render(model.state.search);
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in the state)
  model.updateServings(newServings);
  // Update the recipeView
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1)Update the recipe bookmark (in the state)
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2)Update the recipeView
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render Recipe
    recipeView.render(model.state.recipe);
    //succes message
    addRecipeView.renderMessage();
    // Render Bookmarks
    bookmarksView.render(model.state.bookmarks);
    // Change ID in the URl
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(contolPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
