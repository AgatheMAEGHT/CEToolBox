import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ingredient, ingredientDB, recipe } from '../../../../components/types';
import { requester } from '../../../../components/requester';
import { button } from '../../../../components/components';

import './recipes-detail.css';

function RecipesDetail() {
    let navigate = useNavigate();
    let name = useParams()?.itemName ?? "";

    const [recipe, setRecipe] = React.useState<recipe>({
        _id: '',
        name: '',
        image: "/food-icons/recipe/back.jpg",
        ingredients: [{
            _id: '',
            name: name,
            tags: [],
            kcalPerGram: 2,
            toGramFactor: 1,
            restrictions: {
                isVegan: true,
                isVeggie: true,
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
                isCheeseFree: true,
                isFishFree: true
            }
        }],
        quantities: [10, 5],
        numberOfPortions: 1,
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

        return <span id='table-list-time'
        >
            <div className='recipes-list-table-cell-time-line'>
                <img alt="clock" className="recipes-icons rotating" src='/food-icons/recipe/prepa.png' />
                {prepHours > 0 && (prepHours + "h ")}
                {prepTime}
            </div>
            <div className='recipes-list-table-cell-time-line'>
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
                className='recipes-list-table-cell-tag'
                style={{ backgroundColor: "#" + recipe.categories[j]?.color }}
            >
                {recipe.categories[j].name}</span>);
        }
        return <div>
            <p>Catégories</p>
            <span id='table-list-categories'>{recipe.categories.length === 0 ? "Aucune" : categories}</span>
        </div>
    }

    function originToHtml(): JSX.Element {
        return <span className='recipes-list-table-cell-tag' style={{ backgroundColor: "#" + recipe.origin?.color }}>
            {recipe.origin.name}</span>
    }

    function statusToHtml(): JSX.Element {
        return <span className='recipes-detail-tag' style={{ backgroundColor: "#" + recipe.status?.color }}>
            {recipe.status.name}</span>
    }

    function kcalPerPortion(): JSX.Element {
        let portion: number = 0;
        for (let j = 0; j < recipe.ingredients?.length; j++) {
            portion += recipe.ingredients[j].kcalPerGram * recipe.ingredients[j].toGramFactor * recipe.quantities[j];
        }
        return <span id='recipes-table-kcalPerPortion'><b>{portion} kcal</b><br />par portion</ span>
    }

    function typeToHtml(): JSX.Element {
        return <span className='recipes-detail-tag' style={{ backgroundColor: "#" + recipe.type?.color }}>
            {recipe.type.name}</span>
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
            <div id='recipes-detail-restrictions'>
                {isVegan ? <img alt="vegan" className="recipes-detail-restrictions-icon" src='/food-icons/vegan.png' /> : ""}
                {isVeggie ? <img alt="veggie" className="recipes-detail-restrictions-icon" src='/food-icons/veggie.png' /> : ""}
                {isGlutenFree ? <img alt="gluten free" className="recipes-detail-restrictions-icon" src='/food-icons/glutenFree.png' /> : ""}
                {isCheeseFree ? <img alt="cheese free" className="recipes-detail-restrictions-icon" src='/food-icons/cheeseFree.png' /> : ""}
                {isFishFree ? <img alt="fish free" className="recipes-detail-restrictions-icon" src='/food-icons/fishFree.png' /> : ""}
                {!isVegan && !isVeggie && !isGlutenFree && !isCheeseFree && !isFishFree ? "Aucune restriction" : ""}
            </div>
        </div>;
    }

    function ingredientsTable(): JSX.Element {
        let ingredients: JSX.Element[] = [];
        for (let j = 0; j < recipe.ingredients?.length; j++) {
            let ingredient: ingredientDB = recipe.ingredients[j];
            ingredients.push(<tr key={j}>
                <td className='recipes-detail-cell'><input value={ingredient.name} onChange={e => {
                    let newIngredients: ingredientDB[] = [...recipe.ingredients];
                    newIngredients[j].name = e.target.value;
                    setRecipe({ ...recipe, ingredients: newIngredients })
                }}></input></td>
                <td className='recipes-detail-cell'>{recipe.quantities[j] * recipe.numberOfPortions}</td>
                <td className='recipes-detail-cell'>{recipe.ingredients[j].kcalPerGram * recipe.quantities[j] * recipe.numberOfPortions} kcal</td>
            </tr>);
        }
        return <table id='recipes-table-ingredients'>
            <thead className='recipes-detail-table-ingredients-header'>
                <tr id='recipes-detail-table-ingredients'>
                    <th className='recipes-detail-cell'>Ingrédient</th>
                    <th className='recipes-detail-cell'>Quantité</th>
                    <th className='recipes-detail-cell'>Kcal</th>
                </tr>
            </thead>
            <tbody>
                {ingredients}
            </tbody>
        </table>
    }

    function editRecipe(): void {
        let recipeNew: recipe = {
            _id: '',
            name: '',
            image: "",
            ingredients: [],
            quantities: [],
            numberOfPortions: 0,
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

    return <div id="recipes-detail" className='page table-list'>
        {/* TEST */}
        <div id="ingredient-detail-delete">{button({ text: "Supprimer l'ingrédient", onClick: () => deleteIngredient(), del: true })} </div>
        <div id="ingredient-detail-back">{button({ text: "Retourner à la liste des ingrédients", onClick: () => navigate('/food/ingredients') })}</div>

        <div id='recipes-detail-back'>
            <img alt="book" id='recipes-detail-book' src='/food-icons/recipe/book.jpg' />
            <div id='recipes-detail-left-page' className='recipes-detail-page'>
                <h2 id='recipes-detail-name'>{name}</h2>
                <div id="recipes-detail-infos">
                    <div className='recipes-detail-infos-side-img'>
                        {time()}
                        {typeToHtml()}
                    </div>
                    <div className='recipes-detail-infos-side-img'>
                        {statusToHtml()}
                        {kcalPerPortion()}
                        {originToHtml()}
                    </div>
                    <img alt="recipe" id='recipes-detail-image' src={recipe.image} />
                </div>
                <div id='recipes-detail-top-infos'>
                    {restrictionsToHtml()}
                </div>
                <div>
                    <h3>Nombre de personnes</h3>
                    <div id="recipes-detail-number">
                        {button({ text: "-", onClick: () => setRecipe({ ...recipe, numberOfPortions: (recipe.numberOfPortions - 1) }), width: '11px', padding: "4px 10px 7px", rounded: true, disabled: recipe.numberOfPortions <= 1 })}
                        {recipe.numberOfPortions}
                        {button({ text: "+", onClick: () => setRecipe({ ...recipe, numberOfPortions: (recipe.numberOfPortions + 1) }), width: '11px', padding: "4px 10px 7px", rounded: true })}
                    </div>
                    <h3>Ingrédients</h3>
                    {ingredientsTable()}
                </div>
            </div>

            <div id='recipes-detail-right-page' className='recipes-detail-page'>
            </div>
        </div>
    </div>
}

export default RecipesDetail;