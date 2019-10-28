import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
// import { stat } from 'fs';

/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked reipes
 */

const state = {};

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. Get Query frm the View
    // const query = 'pizza'; //TODO
    const query = searchView.getInput();
    // console.log(query);

    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
              // 4) Search for recipes get recipe data and parse ingredients
        await state.search.getResults();
        console.log(state.recipe.ingredients);
        // state.recipe.parseIngredients();
        // state.recipe.parseIngredients();

        // 5) render results on UI
        clearLoader();
        searchView.renderReults(state.search.result);
        // console.log(state.search.result);
        } catch(err) {
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
    if(btn) {
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

    if(id) {
        //Prepare URL for changes

        //Create ne recipe object
        state.recipe = new Recipe(id);

        //TESTING
        // window.r = state.recipe;

        try {
            //get recipe data
       await state.recipe.getRecipe();
       //calculate servings and time
       state.recipe.calcTime();
       state.recipe.calcServings();

       //render recipe
       console.log(state.recipe);
        } catch (err){
            alert('Error processing recipe');
        }
        
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));





















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