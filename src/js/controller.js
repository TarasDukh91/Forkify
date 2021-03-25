import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js'
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js'
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if(module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try{
    // Getting id
    const id = window.location.hash.slice(1);
    
    if(!id) return

    recipeView.renderSpinner();

    // 0. Update selected view to mark a selected recipe
    resultsView.update(model.getSearchResultsPage())
    
    // 1. Loading Recipe
    await model.loadRecipe(id)
    
    // 2.Render Recipe
    recipeView.render(model.state.recipe)
    // 3. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks)
  } catch(err) {
    recipeView.renderError()
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery()

    if(!query) return;
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage(2));

    // Render pagination
    paginationView.render(model.state.search)
  } catch(err) {
    console.log(err);
  }
}

function controlPagination(goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search)
}

function controlServings(newServings) {
  
  // Update recipe servings(in state)
  model.updateServings(newServings)
  
  // Update recipe servings in view
  recipeView.update(model.state.recipe);
};

function controlAddBookmark() {
  // Add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try{
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe)

    // Display success message
    addRecipeView.renderMessage();

    // Add bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `${model.state.recipe.id}`)

    // Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch(err) {
    console.error(err);
    addRecipeView.renderError(err.message)
  }

}

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();
}

init();
