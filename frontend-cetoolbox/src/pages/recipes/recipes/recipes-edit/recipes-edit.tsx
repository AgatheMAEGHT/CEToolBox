import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ingredient, ingredientDB, recipe, tag } from '../../../../components/types';
import { requester } from '../../../../components/requester';
import { button } from '../../../../components/components';

import './recipes-edit.css';

function RecipesEdit() {
    let navigate = useNavigate();
    let name = useParams()?.itemName ?? "";

    // TO DO: remove test data
    const [recipe, setRecipe] = React.useState<recipe>({
        _id: '',
        name: name,
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
        notes: ["", "Dorure"],
        numberOfPortions: 1,
        preparationTime: 0, // en minutes
        cookingTime: 121, // en minutes
        categories: [{ _id: "", name: "Dessert", color: "fff987" }, { _id: "", name: "Goûter", color: "fff987" }, { _id: "", name: "Autre", color: "fff987" }], // entrée, plat, dessert, apéro, petit-déjeuner, goûter, brunch, boisson
        origin: { _id: "", name: "Autriche", color: "fff987" }, // pays d'origine
        status: { _id: "0", name: "À tester", color: "858000" }, // approuvé, à tester, refusé
        type: { _id: "", name: "Sucré-Salé", color: "f00199" }, // salé, sucré, sucré-salé
        steps: ["Tiédir le lait 10 secondes au micro-ondes et y diluer la levure. Laisser reposer quelques minutes.", "Dans le bol du robot, mettre la farine, le sucre, le mélange lait-levure et le rhum. Pétrir à vitesse lente (vitesse 1) pendant 2 minutes.", "Ajouter le sel et les oeufs. Pétrir, toujours vitesse 1, pendant 5 minutes.", "Ajouter le beurre en parcelles, pétrir à vitesse 2 pendant 10 minutes. Puis augmenter la vitesse (vitesse 6) et pétrir encore 5 minutes.", "Rassembler la pâte au centre du bol, couvrir d’un film alimentaire et laisser pousser à température ambiante pendant 3 heures.", "Dégazer le pâton sur un plan de travail fariné, incorporer la fève et faire une boule.", "Creuser un trou au centre avec l’index et le majeur farinés, l’élargir, puis faire tourner la couronne avec les 2 mains pour agrandir suffisamment la couronne et le trou (afin qu’il ne se referme pas pendant la cuisson). Ma couronne mesure 20 cm de diamètre sur l’extérieur et le trou 9 cm de diamètre.", "Poser la brioche sur une plaque perforée tapissée de papier sulfurisé et la couvrir d’un torchon propre et sec. Laisser lever 1h30.", "Préchauffer le four à 180°c, chaleur tournante. Mélanger le jaune d’oeuf de la dorure avec la pincée de fleur de sel et la crème liquide. Badigeonner la surface.", "Saupoudrer abondamment de sucre perlé et enfourner 20 minutes.", "A la fin de cuisson, sortir la brioche et laisser refroidir entre 5 et 10 minutes. Puis la retirer du papier sulfurisé et la placer sur le plat de service. Laisser encore refroidir 15 minutes puis l’emballer de film alimentaire. Conserver à température ambiante, à l’abri de la lumière."], // markdown
    });
    const [categories, setCategories] = React.useState<tag[]>([]);
    const [origins, setOrigins] = React.useState<tag[]>([]);
    const [statuses, setStatuses] = React.useState<tag[]>([]);
    const [types, setTypes] = React.useState<tag[]>([]);
    const [ingredients, setIngredients] = React.useState<ingredient[]>([]);

    React.useEffect(() => {
        // Get the recipe from the database
        // Get the categories from the database
        // Get the origins from the database
        // Get the statuses from the database
        // Get the types from the database
        // Get the ingredients from the database
    }, []);

    // Time
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
                <input className='input' value={prepHours}></input>
                h
                <input className='input' value={prepMinutes}></input>
                min
            </div>
            <div className='recipes-list-table-cell-time-line'>
                <img alt="clock" className="recipes-icons rotating" src='/food-icons/recipe/oven.png' />
                <input className='input' value={prepHours}></input>
                h
                <input className='input' value={prepMinutes}></input>
                min
            </div>
        </span >;
    }

    // Ingredients
    function ingredientsTable(): JSX.Element {
        let ingredients: JSX.Element[] = [];
        for (let j = 0; j < recipe.ingredients?.length; j++) {
            let ingredient: ingredientDB = recipe.ingredients[j];
            ingredients.push(<tr key={j}>
                <td className='recipes-edit-cell table-list-name' onClick={() => navigate("/food/ingredients/" + recipe.ingredients[j].name)}>{recipe.ingredients[j].name}</td>
                <td className='recipes-edit-cell'>
                    <input type='number' className='input-transparent'
                        value={recipe.quantities[j] * recipe.numberOfPortions}
                        onChange={(e) => setRecipe({ ...recipe, quantities: recipe.quantities.map((quantity, i) => i === j ? e.target.valueAsNumber / recipe.numberOfPortions : quantity) })}>
                    </input>
                </td>
                <td className='recipes-edit-cell'>
                    <input className='input-transparent table-input' value={recipe.notes[j]} onChange={(e) => setRecipe({ ...recipe, notes: recipe.notes.map((note, i) => i === j ? e.target.value : note) })}></input>
                </td>
                <td className='recipes-edit-cell'>{recipe.ingredients[j].kcalPerGram * recipe.quantities[j] * recipe.numberOfPortions}</td>
            </tr>);
        }
        return <table id='recipes-table-ingredients'>
            <thead className='recipes-edit-table-ingredients-header'>
                <tr id='recipes-edit-table-ingredients'>
                    <th className='recipes-edit-cell'>Ingrédient</th>
                    <th className='recipes-edit-cell'>Quantité</th>
                    <th className='recipes-edit-cell'>Note</th>
                    <th className='recipes-edit-cell'>Kcal</th>
                </tr>
            </thead>
            <tbody>
                {ingredients}
            </tbody>
        </table>
    }

    // Steps
    function editStep(index: number, value: string): void {
        let steps: string[] = recipe.steps;
        steps[index] = value;
        setRecipe({ ...recipe, steps });
    }
    function stepstoHtml(): JSX.Element {
        let steps: JSX.Element[] = [];
        for (let j = 0; j < recipe.steps?.length; j++) {
            let step: string = recipe.steps[j];
            steps.push(<div key={j} className='recipes-edit-step'>
                <div className='recipes-edit-step-number'>{j + 1}</div>
                <textarea className='recipes-edit-step-text' value={step} onChange={(e) => editStep(j, e.target.value)} />
                {button({ text: "Supprimer", onClick: () => { setRecipe({ ...recipe, steps: recipe.steps.filter((_, i) => i !== j) }) }, rounded: false, del: true })}
            </div>);
        }
        return <div id='recipes-edit-steps'>
            <div id='recipes-edit-step-list'>{steps}</div>
            {button({ text: "Ajouter une étape", onClick: () => { setRecipe({ ...recipe, steps: [...recipe.steps, ""] }) }, rounded: false })}
        </div>
    }

    // Delete, edit
    function deleteRecipe(): void {
        // Delete the element from the recipe list
        requester('/recipes?_id=' + recipe._id, 'DELETE').then((res: any) => {
            navigate('/food/recipes');
        });
    }

    function editRecipe(): void {
        // Edit the element from the recipe list
        requester('/recipes?_id=' + recipe._id, 'PUT', recipe).then((res: any) => {
            navigate('/food/recipes/' + recipe.name);
        });
    }

    return <div id="recipes-edit" className='page'>
        <div id='recipes-edit-top-buttons'>
            <div id=''>{button({ text: "Retourner à la liste des recettes", onClick: () => navigate('/food/recipes') })}</div>
            <div id='recipes-edit-top-buttons-center'>{button({ text: "Sauvegarder", onClick: () => editRecipe() })} </div>
            <div id='recipes-edit-top-buttons-right'>{button({ text: "Supprimer la recette", onClick: () => deleteRecipe(), del: true })} </div>
        </div>

        <input className='input-transparent input-name' value={recipe.name} onChange={(e) => setRecipe({ ...recipe, name: e.target.value })} />
        <div id='recipes-edit-top-infos'>
            <img alt="recipe" id='recipes-edit-image' src={recipe.image} />
            {time()}
            <select className='select' value={recipe.status?._id} onChange={(e) => setRecipe({ ...recipe, status: { _id: e.target.value, name: recipe.status?.name ?? "", color: recipe.status?.color ?? "" } })}>
                {statuses.map((status, i) => <option key={i} value={status._id}>{status.name}</option>)}
            </select>
            <select className='select' value={recipe.type?._id} onChange={(e) => setRecipe({ ...recipe, type: { _id: e.target.value, name: recipe.type?.name ?? "", color: recipe.type?.color ?? "" } })}>
                {types.map((type, i) => <option key={i} value={type._id}>{type.name}</option>)}
            </select>
            <select className='select' value={recipe.origin?._id} onChange={(e) => setRecipe({ ...recipe, origin: { _id: e.target.value, name: recipe.origin?.name ?? "", color: recipe.origin?.color ?? "" } })}>
                {origins.map((origin, i) => <option key={i} value={origin._id}>{origin.name}</option>)}
            </select>
            <select className='select' value={recipe.categories[0]?._id} onChange={(e) => setRecipe({ ...recipe, categories: [{ _id: e.target.value, name: recipe.categories[0]?.name ?? "", color: recipe.categories[0]?.color ?? "" }] })}>
                {categories.map((category, i) => <option key={i} value={category._id}>{category.name}</option>)}
            </select>
        </div>
        <div>
            <h3>Ce plat est prévu pour {recipe.numberOfPortions} personne{recipe.numberOfPortions > 1 && "s"}</h3>
            <div id="recipes-edit-number">
                {button({ text: "-", onClick: () => setRecipe({ ...recipe, numberOfPortions: (recipe.numberOfPortions - 1) }), width: '11px', padding: "4px 10px 7px", rounded: true, disabled: recipe.numberOfPortions <= 1 })}
                {recipe.numberOfPortions}
                {button({ text: "+", onClick: () => setRecipe({ ...recipe, numberOfPortions: (recipe.numberOfPortions + 1) }), width: '11px', padding: "4px 10px 7px", rounded: true })}
            </div>
            <h3>Ingrédients</h3>
            {ingredientsTable()}
        </div>
        <h3>Préparation</h3>
        {stepstoHtml()}
    </div>
}

export default RecipesEdit;