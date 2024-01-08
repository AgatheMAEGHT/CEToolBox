import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ingredient, ingredientDB, recipe } from '../../../../components/types';
import { requester } from '../../../../components/requester';
import { button } from '../../../../components/components';

import './recipes-detail.css';

function RecipesDetail() {
    let navigate = useNavigate();
    let name = useParams()?.itemName ?? "";

    const [number, setNumber] = React.useState<number>(1); // nombre de personnes
    const [recipe, setRecipe] = React.useState<recipe>({
        _id: '',
        name: '',
        image: "",
        ingredients: [{
            _id: '',
            name: name,
            tags: [],
            kcalPerGram: 2,
            toGramFactor: 1,
            restrictions: {
                isVegan: true,
                isVeggie: false,
                isGlutenFree: true,
                isCheeseFree: true,
                isFishFree: true
            }
        },
        {
            _id: '',
            name: name,
            tags: [],
            kcalPerGram: 3.5,
            toGramFactor: 1,
            restrictions: {
                isVegan: true,
                isVeggie: true,
                isGlutenFree: true,
                isCheeseFree: false,
                isFishFree: false
            }
        }],
        quantities: [10, 5],
        preparationTime: 0, // en minutes
        cookingTime: 121, // en minutes
        categories: [], // entrée, plat, dessert, apéro, petit-déjeuner, goûter, brunch, boisson
        origin: { _id: "", name: "", color: "" }, // pays d'origine
        status: { _id: "0", name: "À tester", color: "fff000" }, // approuvé, à tester, refusé
        type: { _id: "", name: "Sucré-Salé", color: "f00199" }, // salé, sucré, sucré-salé
        steps: [], // markdown
    });

    React.useEffect(() => {
        // Get the recipe from the database
    }, []);

    function time(): JSX.Element {
        let prepHours: number = Math.floor(recipe.preparationTime / 60);
        let prepMinutes: number = recipe.preparationTime % 60;
        let prepTime: string = prepHours > 0 ? prepHours + "h " : "";
        if (prepMinutes > 0) {
            if (prepMinutes.toString.length === 1 && prepHours !== 0) {
                prepTime += "0";
            }
            prepTime += prepMinutes;
            prepTime += prepHours === 0 ? " min" : "";
        }
        if (prepTime === "") prepTime = "0 min";

        let cookHours: number = Math.floor(recipe.cookingTime / 60);
        let cookMinutes: number = recipe.cookingTime % 60;
        let cookTime: string = cookHours > 0 ? cookHours + "h " : "";
        if (cookMinutes > 0) {
            if (cookMinutes.toString.length === 1 && cookHours !== 0) {
                cookTime += "0";
            }
            cookTime += cookMinutes;
            cookTime += cookHours === 0 ? " min" : "";
        }
        if (cookTime === "") cookTime = "0 min";

        return <span id='recipes-table-time'
        >
            <div className='recipes-table-cell-time-line'>
                <img alt="clock" className="recipes-icons rotating" src='/food-icons/recipe/prepa.png' />
                {prepHours > 0 && (prepHours + "h ")}
                {prepTime}
            </div>
            <div className='recipes-table-cell-time-line'>
                <img alt="clock" className="recipes-icons rotating" src='/food-icons/recipe/oven.png' />
                {cookTime}
            </div>
        </span >;
    }

    function categoriesToHtml(): JSX.Element {
        let categories: JSX.Element[] = [];
        for (let j = 0; j < recipe.categories?.length; j++) {
            categories.push(<span
                key={j}
                className='recipes-table-cell-tag'
                style={{ backgroundColor: "#" + recipe.categories[j]?.color }}
            >
                {recipe.categories[j].name}</span>);
        }
        return <div>
            <p>Catégories</p>
            <span id='recipes-table-categories'>{recipe.categories.length === 0 ? "Aucune" : categories}</span>
        </div>
    }

    function originToHtml(): JSX.Element {
        return <div>
            <p>Origine</p>
            <span className='recipes-table-cell-tag' style={{ backgroundColor: "#" + recipe.origin?.color }}>
                {recipe.origin.name}</span>
        </div>
    }

    function statusToHtml(): JSX.Element {
        return <div>
            <p>Status</p>
            <span className='recipes-table-cell-tag' style={{ backgroundColor: "#" + recipe.status?.color }}>
                {recipe.status.name}</span>
        </div>
    }

    function typeToHtml(): JSX.Element {
        return <div>
            <p>Type</p>
            <span className='recipes-table-cell-tag' style={{ backgroundColor: "#" + recipe.type?.color }}>
                {recipe.type.name}</span>
        </div>
    }

    function kcalPerPortion(): JSX.Element {
        let portion: number = 0;
        for (let j = 0; j < recipe.ingredients?.length; j++) {
            portion += recipe.ingredients[j].kcalPerGram * recipe.ingredients[j].toGramFactor * recipe.quantities[j];
        }
        return <div>
            <p>Kcal par portion</p>
            <span id='recipes-table-kcalPerPortion'>{portion} kcal</ span>;
        </div>
    }

    function restrictionsToHtml(): JSX.Element {
        let isVegan: boolean = true;
        let isVeggie: boolean = true;
        let isGlutenFree: boolean = true;
        let isCheeseFree: boolean = true;
        let isFishFree: boolean = true;

        for (let j = 0; j < recipe.ingredients?.length; j++) {
            isVegan = isVegan && recipe.ingredients[j].restrictions.isVegan;
            isVeggie = isVeggie && recipe.ingredients[j].restrictions.isVeggie;
            isGlutenFree = isGlutenFree && recipe.ingredients[j].restrictions.isGlutenFree;
            isCheeseFree = isCheeseFree && recipe.ingredients[j].restrictions.isCheeseFree;
            isFishFree = isFishFree && recipe.ingredients[j].restrictions.isFishFree;
        }

        return <div>
            <p>Restrictions</p>
            <div id='recipes-recipe-restrictions'>
                {isVegan ? <img alt="vegan" className="recipes-restrictions-icon" src='/food-icons/vegan.png' /> : ""}
                {isVeggie ? <img alt="veggie" className="recipes-restrictions-icon" src='/food-icons/veggie.png' /> : ""}
                {isGlutenFree ? <img alt="gluten free" className="recipes-restrictions-icon" src='/food-icons/glutenFree.png' /> : ""}
                {isCheeseFree ? <img alt="cheese free" className="recipes-restrictions-icon" src='/food-icons/cheeseFree.png' /> : ""}
                {isFishFree ? <img alt="fish free" className="recipes-restrictions-icon" src='/food-icons/fishFree.png' /> : ""}
                {!isVegan && !isVeggie && !isGlutenFree && !isCheeseFree && !isFishFree ? "Aucune" : ""}
            </div>
        </div>;
    }

    function ingredientsTable(): JSX.Element {
        let ingredients: JSX.Element[] = [];
        for (let j = 0; j < recipe.ingredients?.length; j++) {
            let ingredient: ingredientDB = recipe.ingredients[j];
            ingredients.push(<tr key={j} className='recipes-table-row'>
                <td className='recipes-table-cell'><input value={ingredient.name} onChange={e => {
                    let newIngredients: ingredientDB[] = [...recipe.ingredients];
                    newIngredients[j].name = e.target.value;
                    setRecipe({ ...recipe, ingredients: newIngredients })
                }}></input></td>
                <td className='recipes-table-cell'>{recipe.quantities[j] * number}</td>
                <td className='recipes-table-cell'>{recipe.ingredients[j].kcalPerGram * recipe.quantities[j] * number} kcal</td>
            </tr>);
        }
        return <div id='recipes-table-ingredients'>
            <table id='recipes-table-ingredients'>
                <thead>
                    <tr className='recipes-table-row recipes-table-ingredients-header'>
                        <th className='recipes-table-cell'>Ingrédient</th>
                        <th className='recipes-table-cell'>Quantité</th>
                        <th className='recipes-table-cell'>Kcal</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients}
                </tbody>
            </table>
        </div>;
    }

    function editRecipe(): void {
        let recipeNew: recipe = {
            _id: '',
            name: '',
            image: "",
            ingredients: [],
            quantities: [],
            preparationTime: 0, // en minutes
            cookingTime: 0, // en minutes
            categories: [], // entrée, plat, dessert, apéro, petit-déjeuner, goûter, brunch, boisson
            origin: { _id: "", name: "", color: "" }, // pays d'origine
            status: { _id: "", name: "", color: "" }, // approuvé, à tester, refusé
            type: { _id: "", name: "", color: "" }, // salé, sucré, sucré-salé
            steps: [], // markdown
        }

        // Edit the element from the ingredient list
        requester('/ingredients', 'PUT', recipeNew).then((res: any) => {
            setRecipe(res);
            navigate('/food/recipes');
        });
    }

    function deleteIngredient(): void {
        // Delete the element from the recipe list
        requester('/ingredients?_id=' + recipe._id, 'DELETE').then((res: any) => {
            navigate('/food/ingredients');
        });
    }

    return <div id="recipes-detail" className='page recipes-table'>
        <div id="ingredient-detail-back">{button({ text: "Retourner à la liste des ingrédients", onClick: () => navigate('/food/ingredients') })}</div>
        <div id="ingredient-detail-delete">{button({ text: "Supprimer l'ingrédient", onClick: () => deleteIngredient(), del: true })} </div>

        <h2>Recettes de la CE Toolbox</h2>
        {kcalPerPortion()}
        {restrictionsToHtml()}
        <div>
            {typeToHtml()}
        </div>

        <div>
            <h3>Nombre de personnes</h3>
            <div id="recipes-detail-number">
                {button({ text: "-", onClick: () => setNumber(number - 1), width: '11px', rounded: true, disabled: number <= 1 })}
                {number}
                {button({ text: "+", onClick: () => setNumber(number + 1), width: '11px', rounded: true })}
            </div>
            <h3>Ingrédients</h3>
            {ingredientsTable()}
        </div>
    </div>
}

export default RecipesDetail;