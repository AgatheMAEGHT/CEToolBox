import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Bar, Container, Section } from '@column-resizer/react';
import { recipe } from '../../../components/types';
import { requester } from '../../../components/requester';
import './recipes.css';

function RecipesList() {
    let navigate = useNavigate();

    const [table, setTable] = React.useState<recipe[]>([
        {
            _id: '',
            name: '_new',
            image: "",
            ingredients: [],
            quantities: [],
            notes: [],
            numberOfPortions: 0,
            preparationTime: 0, // en minutes
            cookingTime: 2200, // en minutes
            categories: [], // entrée, plat, dessert, apéro, petit-déjeuner, goûter, brunch, boisson
            origin: { _id: "", name: "", color: "" }, // pays d'origine
            status: { _id: "0", name: "À tester", color: "fff000" }, // approuvé, à tester, refusé
            type: { _id: "", name: "Sucré-Salé", color: "f00199" }, // salé, sucré, sucré-salé
            steps: [], // markdown
        }
    ]);

    React.useEffect(() => {
        // Get the recipes from the database
        // requester('/recipes', 'GET').then((res: any) => {
        //     if (res === null) return;
        //     setTable(res);
        // });
    }, []);

    // Change the color of the line in the table
    function changeColor(i: number, select: boolean): void {
        let element: HTMLElement | null = document.getElementById('table-list-name' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-time' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-categories' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-origin' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-status' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-type' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-kcalPerPortion' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-restrictions' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }
    }

    function setHeights(): void {
        let heights: number[] = JSON.parse(localStorage.getItem('table-list-heights') || '[]');

        let headerNames: number = document.getElementById('table-list-name')?.offsetWidth ?? 0;
        let headerTime: number = document.getElementById('table-list-time')?.offsetWidth ?? 0;
        let headerCategories: number = document.getElementById('table-list-categories')?.offsetWidth ?? 0;
        let headerOrigin: number = document.getElementById('table-list-origin')?.offsetWidth ?? 0;
        let headerStatus: number = document.getElementById('table-list-status')?.offsetWidth ?? 0;
        let headerType: number = document.getElementById('table-list-type')?.offsetWidth ?? 0;
        let headerKcalPerPortion: number = document.getElementById('table-list-kcalPerPortion')?.offsetWidth ?? 0;
        let headerRestrictions: number = document.getElementById('recipes-restrictions')?.offsetWidth ?? 0;

        // If headers width changed
        if (headerNames !== heights[0] || headerTime !== heights[1] || headerCategories !== heights[2] ||
            headerOrigin !== heights[3] || headerStatus !== heights[4] || headerType !== heights[5] ||
            headerKcalPerPortion !== heights[6] || headerRestrictions !== heights[7]) {

            // Get the heights of the lines
            for (let i = 0; i < heights?.length; i++) {
                let element: HTMLElement | null = document.getElementById('table-list-name' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-time' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-categories' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-origin' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-status' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-type' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-kcalPerPortion' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('recipes-restrictions' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }
            }

            // Set the heights to the lines
            for (let i = 0; i < heights?.length; i++) {
                let element: HTMLElement | null = document.getElementById('table-list-name' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-time' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-categories' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-origin' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-status' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-type' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-kcalPerPortion' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('recipes-restrictions' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }
            }
        }
    }

    // Set the heights of the lines for the first time
    React.useEffect(() => {
        setHeights();
    }, [table]);

    function tableToHtml(): JSX.Element {
        let htmlTable: JSX.Element[] = [];

        let names: JSX.Element[] = [<span key="header" className='table-list-header' id='recipes-name'>Nom</span>];
        let time: JSX.Element[] = [<span key="header" className='table-list-header' id='recipes-time'>Temps</span>];
        let categories: JSX.Element[] = [<span key="header" className='table-list-header' id='recipes-categories'>Catégories</span>];
        let origin: JSX.Element[] = [<span key="header" className='table-list-header' id='recipes-origin'>Origine</span>];
        let status: JSX.Element[] = [<span key="header" className='table-list-header' id='recipes-status'>Status</span>];
        let type: JSX.Element[] = [<span key="header" className='table-list-header' id='recipes-type'>Type</span>];
        let kcalPerPortion: JSX.Element[] = [<span key="header" className='table-list-header' id='recipes-kcal'>Kcal / portion</span>];
        let restrictions: JSX.Element[] = [<span key="header" className='table-list-header' id='recipes-restrictions'>Restrictions</span>];

        let heights: number[] = [];

        for (let i = 0; i < table?.length; i++) {
            // Names
            {
                names.push(<a
                    key={i}
                    id={'table-list-name' + i}
                    className='table-list-cell table-list-name'
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                    href={"/food/recipes/" + table[i].name}
                >
                    {table[i].name}
                </a>);
            }

            // Time
            {
                let prepHours: number = Math.floor(table[i].preparationTime / 60);
                let prepMinutes: number = table[i].preparationTime % 60;
                let prepTime: string = prepHours > 0 ? prepHours + "h " : "";
                if (prepMinutes > 0) {
                    if (prepMinutes.toString().length === 1 && prepHours !== 0) {
                        prepTime += "0";
                    }
                    prepTime += prepMinutes;
                    prepTime += prepHours === 0 ? " min" : "";
                }
                if (prepTime === "") prepTime = "0 min";

                let cookHours: number = Math.floor(table[i].cookingTime / 60);
                let cookMinutes: number = table[i].cookingTime % 60;
                let cookTime: string = cookHours > 0 ? cookHours + "h " : "";
                if (cookMinutes > 0) {
                    if (cookMinutes.toString().length === 1 && cookHours !== 0) {
                        cookTime += "0";
                    }
                    cookTime += cookMinutes;
                    cookTime += cookHours === 0 ? " min" : "";
                }
                if (cookTime === "") cookTime = "0 min";

                time.push(<span
                    key={i}
                    className='table-list-cell table-list-cell-time'
                    id={'table-list-time' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    <div className='recipes-list-table-cell-time-line'>
                        <img alt="clock" className="recipes-icons rotating" src='/food-icons/recipe/prepa.png' />
                        {prepTime}
                    </div>
                    <div className='recipes-list-table-cell-time-line'>
                        <img alt="clock" className="recipes-icons rotating" src='/food-icons/recipe/oven.png' />
                        {cookTime}
                    </div>
                </span>);
            }

            // Categories
            {
                let cellCategories: JSX.Element[] = [];
                for (let j = 0; j < table[i].categories?.length; j++) {
                    cellCategories.push(<span
                        key={j}
                        className='recipes-list-table-cell-tag'
                        style={{ backgroundColor: "#" + table[i].categories[j]?.color }}
                    >
                        {table[i].categories[j].name}</span>);
                }
                categories.push(<span
                    key={i} className='table-list-cell table-list-categories' id={'table-list-categories' + i}
                    onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}
                >
                    {table[i].categories.length === 0 ? "Aucune" : cellCategories}
                </span>);
            }

            // Origin
            {
                origin.push(<span
                    key={i}
                    className='table-list-cell table-list-origin'
                    id={'table-list-origin' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    <span key={i + "-tag"} className='recipes-list-table-cell-tag' style={{ backgroundColor: "#" + table[i].origin?.color }}>
                        {table[i].origin.name}</span>
                </span>);
            }

            // Status
            {
                status.push(<span
                    key={i}
                    className='table-list-cell table-list-status'
                    id={'table-list-status' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    <span key={i + "-tag"} className='recipes-list-table-cell-tag' style={{ backgroundColor: "#" + table[i].status?.color }}>
                        {table[i].status.name}</span>
                </span>);
            }

            // Type
            {
                type.push(<span
                    key={i}
                    className='table-list-cell table-list-type'
                    id={'table-list-type' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    <span key={i + "-tag"} className='recipes-list-table-cell-tag' style={{ backgroundColor: "#" + table[i].type?.color }}>
                        {table[i].type.name}</span>
                </span>);
            }

            // kcalPerPortion
            {
                let portion: number = 0;
                for (let j = 0; j < table[i].ingredients?.length; j++) {
                    portion += table[i].ingredients[j].kcalPerGram * table[i].ingredients[j].toGramFactor * table[i].quantities[j];
                }
                kcalPerPortion.push(<span
                    key={i} className='table-list-cell' id={'table-list-kcalPerPortion' + i}
                    onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                    {portion}kcal
                </span>);
            }

            // Restrictions
            {
                let isVegan: boolean = true;
                let isVeggie: boolean = true;
                let isGlutenFree: boolean = true;
                let isCheeseFree: boolean = true;
                let isFishFree: boolean = true;

                for (let j = 0; j < table[i].ingredients?.length; j++) {
                    isVegan = isVegan && table[i].ingredients[j].restrictions.isVegan;
                    isVeggie = isVeggie && table[i].ingredients[j].restrictions.isVeggie;
                    isGlutenFree = isGlutenFree && table[i].ingredients[j].restrictions.isGlutenFree;
                    isCheeseFree = isCheeseFree && table[i].ingredients[j].restrictions.isCheeseFree;
                    isFishFree = isFishFree && table[i].ingredients[j].restrictions.isFishFree;
                }

                restrictions.push(<span key={i} className='table-list-cell recipes-restrictions' id={'recipes-restrictions' + i}
                    onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}
                >
                    {isVegan ? <img alt="vegan" className="recipes-restrictions-icon" src='/food-icons/vegan.png' /> : ""}
                    {isVeggie ? <img alt="veggie" className="recipes-restrictions-icon" src='/food-icons/veggie.png' /> : ""}
                    {isGlutenFree ? <img alt="gluten free" className="recipes-restrictions-icon" src='/food-icons/glutenFree.png' /> : ""}
                    {isCheeseFree ? <img alt="cheese free" className="recipes-restrictions-icon" src='/food-icons/cheeseFree.png' /> : ""}
                    {isFishFree ? <img alt="fish free" className="recipes-restrictions-icon" src='/food-icons/fishFree.png' /> : ""}
                    {!isVegan && !isVeggie && !isGlutenFree && !isCheeseFree && !isFishFree ? "Aucune" : ""}
                </span>);
            }

            // Heights
            heights.push(0);
        }

        htmlTable.push(<Section key={"section-0"} className='table-list-col' id="table-list-col-name" minSize={100}>{names}</Section>);
        htmlTable.push(<Bar key={"bar-0"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-1"} className='table-list-col' minSize={85}>{time}</Section>);
        htmlTable.push(<Bar key={"bar-1"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-2"} className='table-list-col' minSize={90}>{categories}</Section>);
        htmlTable.push(<Bar key={"bar-2"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-3"} className='table-list-col' minSize={80}>{origin}</Section>);
        htmlTable.push(<Bar key={"bar-3"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-4"} className='table-list-col' minSize={60}>{status}</Section>);
        htmlTable.push(<Bar key={"bar-4"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-5"} className='table-list-col' minSize={75}>{type}</Section>);
        htmlTable.push(<Bar key={"bar-5"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-6"} className='table-list-col' minSize={110}>{kcalPerPortion}</Section>);
        htmlTable.push(<Bar key={"bar-6"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-7"} className='table-list-col' minSize={120}>{restrictions}</Section>);

        localStorage.setItem('table-list-heights', JSON.stringify(heights));

        return <Container id='table-list' onMouseOver={() => setHeights()}>{htmlTable}</Container>
    }

    function createNewRecipe(): void {
        let newIngredient: recipe = {
            _id: '',
            name: '_new',
            image: "",
            ingredients: [],
            quantities: [],
            notes: [],
            numberOfPortions: 0,
            preparationTime: 0, // en minutes
            cookingTime: 0, // en minutes
            categories: [], // entrée, plat, dessert, apéro, petit-déjeuner, goûter, brunch, boisson
            origin: { _id: "", name: "", color: "" }, // pays d'origine
            status: { _id: "", name: "", color: "" }, // approuvé, à tester, refusé
            type: { _id: "", name: "", color: "" }, // salé, sucré, sucré-salé
            steps: [], // markdown
        }
        requester('/ingredients', 'POST', newIngredient).then((res: any) => {
            navigate('/food/recipes/_new')
        });
    }

    return <div>
        <div className='sub-header'>
            <h2>Recettes de la CE Toolbox</h2>
            <div className='sub-header-buttons'>
                {/* Meal types (entrées, plats, ...) */}
                <button className='sub-header-button sub-header-button-border' onClick={() => { navigate("/food/recipes?type=aperos") }}>Apéros</button>
                <button className='sub-header-button sub-header-button-border' onClick={() => { navigate("/food/recipes?type=entrees") }}>Entrées</button>
                <button className='sub-header-button sub-header-button-border' onClick={() => { navigate("/food/recipes?type=plats") }}>Plats</button>
                <button className='sub-header-button sub-header-button-border' onClick={() => { navigate("/food/recipes?type=") }}>Accompgnements</button>
                <button className='sub-header-button sub-header-button-border' onClick={() => { navigate("/food/recipes?type=") }}>Desserts</button>
                <button className='sub-header-button sub-header-button-border' onClick={() => { navigate("/food/recipes?type=") }}>Petits-déjeuners</button>
                <button className='sub-header-button sub-header-button-border' onClick={() => { navigate("/food/recipes?type=") }}>Goûters</button>
                <button className='sub-header-button sub-header-button-border' onClick={() => { navigate("/food/recipes?type=") }}>Sauces</button>
                <button className='sub-header-button' onClick={() => { navigate("/food/recipes?type=") }}>Boissons</button>
            </div>
        </div>
        <div id="recipes" className='page'>
            <button className='food-button' onClick={() => { createNewRecipe() }}><div className='food-button-content'>Ajouter une Recette</div></button>

            <div className='block-preview'>
                <div id='table-list-content' style={{ width: "100%" }}>
                    {tableToHtml()}
                </div>
            </div>
            <button className='food-button' onClick={() => { createNewRecipe() }}><div className='food-button-content'>Ajouter une Recette</div></button>
        </div>
    </div>
}

export default RecipesList;