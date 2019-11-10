import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {

    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

/*
our recipe title is 'Pasta with tomato spinach'
acc: 0 / acc + cur.length = 5 ten newTitle = ['Pasta']
acc value is now 5 less than 17
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc value is now 15 still less thn 17
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 (more than 17) / newTitle = ['Pasta', 'with', 'tomato']
acc:
*/

//split(' ') sparates wrd in a sentence and adds them to an array after every space
//join(' ') is te opposite it adds words in a array truns them into a sting (sentence) separated by a space
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumilator, current) => {
            if (accumilator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumilator + current.length;
        }, 0);

        //return result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};
// type: 'prev' or 'next' 
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        //Only One button to go to the next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        //both buttons
        button = `
        
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        
        `;
    } else if (page === pages && pages > 1) {
        //Only One button to go to the previous page
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderReults = (recipes, page = 2, resPerPage = 10) => {
    /* console.log(recipes);
     const start = 1; on page 1 youo want to start from 0 to get the first element then end on 9 to get 10 elemets
     const end = 10;
     */

    // rener results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};