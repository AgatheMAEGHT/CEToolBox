import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ingredient, ingredientDB, recipe } from '../../../../components/types';
import { requester } from '../../../../components/requester';
import { button } from '../../../../components/components';

import './recipes-detail.css';

function RecipesDetail() {
    let navigate = useNavigate();
    let name = useParams()?.itemName ?? "";

    const [ext, setExt] = React.useState<boolean>(true);
    const [recipe, setRecipe] = React.useState<recipe>({
        _id: '',
        name: 'Test',
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
                className='recipes-detail-tag'
                style={{ backgroundColor: "#" + recipe.categories[j]?.color }}
            >
                {recipe.categories[j].name}</span>);
        }
        return <span id='table-list-categories'>{categories}</span>
    }

    function originToHtml(): JSX.Element {
        return <span className='recipes-detail-tag' style={{ backgroundColor: "#" + recipe.origin?.color ?? "white" }}>
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

    // Ingredients
    function ingredientsTable(): JSX.Element {
        let ingredients: JSX.Element[] = [];
        for (let j = 0; j < recipe.ingredients?.length; j++) {
            let ingredient: ingredientDB = recipe.ingredients[j];
            ingredients.push(<tr key={j}>
                <td className='recipes-detail-cell table-list-name' onClick={() => navigate("/food/ingredients/" + recipe.ingredients[j].name)}>{recipe.ingredients[j].name}</td>
                <td className='recipes-detail-cell'>{recipe.quantities[j] * recipe.numberOfPortions}</td>
                <td className='recipes-detail-cell'>{recipe.notes[j]}</td>
                <td className='recipes-detail-cell'>{recipe.ingredients[j].kcalPerGram * recipe.quantities[j] * recipe.numberOfPortions}</td>
            </tr>);
        }
        return <table id='recipes-table-ingredients'>
            <thead className='recipes-detail-table-ingredients-header'>
                <tr id='recipes-detail-table-ingredients'>
                    <th className='recipes-detail-cell'>Ingrédient</th>
                    <th className='recipes-detail-cell'>Quantité</th>
                    <th className='recipes-detail-cell'>Note</th>
                    <th className='recipes-detail-cell'>Kcal</th>
                </tr>
            </thead>
            <tbody>
                {ingredients}
            </tbody>
        </table>
    }

    // Steps
    function steps(): JSX.Element {
        let steps: JSX.Element[] = [];
        for (let j = 0; j < recipe.steps?.length; j++) {
            steps.push(<div key={j} className='recipes-detail-step'>
                <div className='recipes-detail-step-number'>{j + 1}</div>
                <div className='recipes-detail-step-text'>{recipe.steps[j]}</div>
            </div>);
        }
        return <div id='recipes-detail-step-list'>{steps}</div>;
    }

    // Delete
    function deleteRecipe(): void {
        // Delete the element from the recipe list
        requester('/ingredients?_id=' + recipe._id, 'DELETE').then((res: any) => {
            navigate('/food/ingredients');
        });
    }

    return <div id="recipes-detail" className='page table-list'>
        {/* TEST */}
        <div id="ingredient-detail-delete">{button({ text: "Supprimer la recette", onClick: () => deleteRecipe(), del: true })} </div>
        <div id="recipe-detail-edit">{button({ text: "Modifier la recette", onClick: () => navigate("/food/recipes/edit/" + recipe.name) })} </div>
        <div id="ingredient-detail-back">{button({ text: "Retourner à la liste des recettes", onClick: () => navigate('/food/recipes') })}</div>

        <div id='recipes-detail-back'>
            <img alt="book" id='recipes-detail-book' src='/food-icons/recipe/book.jpg' />
            <div id='recipes-detail-left-page' className='recipes-detail-page'>
                <h2 id='recipes-detail-name'>{name}</h2>
                <div id="recipes-detail-infos">
                    <div className='recipes-detail-infos-side-img'>
                        {time()}
                        {kcalPerPortion()}
                    </div>
                    <div className='recipes-detail-infos-side-img'>
                        {statusToHtml()}
                        {typeToHtml()}
                        {recipe.origin.name !== "" && originToHtml()}
                        {recipe.categories.length !== 0 && categoriesToHtml()}
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
                <h3>Préparation</h3>
                {steps()}
            </div>
        </div>
    </div>
}

export default RecipesDetail;