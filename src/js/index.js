import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
// import Likes from './models/Likes';
// import { stat } from 'fs';

/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked reipes
 */

const state = {};
window.state = state;

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. Get Query frm the View
    // const query = 'pizza'; //TODO
    const query = searchView.getInput();
    console.log(query);

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes get recipe data and parse ingredients
            await state.search.getResults();

            // state.recipe.parseIngredients();
            // state.recipe.parseIngredients();

            // 5) render results on UI
            clearLoader();
            searchView.renderReults(state.search.result);
            // console.log(state.search.result);
        } catch (err) {
            console.log(err);
            alert('Something is wrong with the search...');
            clearLoader();
        }


    }
}
//prevnt reloading after submit
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});
//TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();

// });

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderReults(state.search.result, goToPage);
        // console.log(goToPage);
    }
    // console.log(btn);
});

/** 
 * RECIPE CONTROLLER
 * const r = new Recipe(35626);
 * r.getRecipe();
 * console.log(r);
 */
const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //Prepare URL for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);


        if (state.search) searchView.highlightSelected(id);

        //Create ne recipe object
        state.recipe = new Recipe(id);

        //TESTING
        // window.r = state.recipe;

        try {
            //get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
            // console.log(state.recipe);
        } catch (err) {
            console.log(err);
            alert('Error processing recipe');
        }

    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/** 
 * LIST CONTROLLER
 */

const controlList = () => {
    //Create a new List if there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
       const item = state.list.addItem(el.count, el.unit, el.ingredient);
       listView.renderItem(item);
    });
}

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

        //handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});

/** 
 * LIKE CONTROLLER
 */
// TESTING
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toggle the like button
            likesView.toggleLikeBtn(true);
        // Add like to the UI list
        likesView.renderLike(newLike);
        // console.log(state.likes);

        // user HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
        // console.log(state.likes);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked reciped on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle the button
    likesView.toggleLikeMenu(state.likes.getNumLikes());  
    
    // Render the exisiting likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});
 

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {

            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredient(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredient(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //ADD INGREDIENTS TO SHOPPING LIST
        controlList()
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
    // console.log(state.recipe);
    
});

window.l = new List();



















// // const search = new Search('pizza');
// // console.log(search);
// // search.getResults();









// import axios from 'axios';

// async function getResults(query) {
//     const res = await axios('https://randomuser.me/api/');
//     console.log(res.data.results[0].gender);


// }
// getResults();

// getResults('tomato pasta');










// // Global app controller
// // import num from './test';
// // const amor = "E eu nao qis acreditar";
// // console.log(`Falta coragem pra dizer ${num} from test js! ${amor}`);