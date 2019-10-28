import axios from 'axios';
import { key, proxy } from '../config';
import forkJSON from '../../../forkify.json';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {

        // const proxy = 'https://cors-anywhere.herokuapp.com/';
        // const key = '';

        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            // const res = await axios(forkJSON);
            // const res = await axios('https://randomuser.me/api/');
            this.result = res.data.recipes; 
            // this.result = res.data.results[0];
            // this.result = res;
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}

// const res = await axios('https://randomuser.me/api/');
// const res = await axios('https://randomuser.me/api/');
//     console.log(res.data.results[0].gender);

// import axios from 'axios';

// async function getResults(query) {
//     const proxy = 'https://cors-anywhere.herokuapp.com/';
//     const key = 'e66a08f3025327ed041bd222a92d0cd8';

//     try {
//         const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);
//         const recipes = result.data.recipes;
//         console.log(recipes);
//     } catch(error) {
//         alert(error);
//     }

// }
// getResults('tomato pasta');

// getResults('tomato pasta');