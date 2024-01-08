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
            preparationTime: 0, // en minutes
            cookingTime: 121, // en minutes
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
        let element: HTMLElement | null = document.getElementById('recipes-table-name' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-table-time' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-table-categories' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-table-origin' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-table-status' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-table-type' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-table-kcalPerPortion' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-table-restrictions' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }
    }

    function setHeights(): void {
        let heights: number[] = JSON.parse(localStorage.getItem('recipes-table-heights') || '[]');

        let headerNames: number = document.getElementById('recipes-table-name')?.offsetWidth ?? 0;
        let headerTime: number = document.getElementById('recipes-table-time')?.offsetWidth ?? 0;
        let headerCategories: number = document.getElementById('recipes-table-categories')?.offsetWidth ?? 0;
        let headerOrigin: number = document.getElementById('recipes-table-origin')?.offsetWidth ?? 0;
        let headerStatus: number = document.getElementById('recipes-table-status')?.offsetWidth ?? 0;
        let headerType: number = document.getElementById('recipes-table-type')?.offsetWidth ?? 0;
        let headerKcalPerPortion: number = document.getElementById('recipes-table-kcalPerPortion')?.offsetWidth ?? 0;
        let headerRestrictions: number = document.getElementById('recipes-table-restrictions')?.offsetWidth ?? 0;

        // If headers width changed
        if (headerNames !== heights[0] || headerTime !== heights[1] || headerCategories !== heights[2] ||
            headerOrigin !== heights[3] || headerStatus !== heights[4] || headerType !== heights[5] ||
            headerKcalPerPortion !== heights[6] || headerRestrictions !== heights[7]) {

            // Get the heights of the lines
            for (let i = 0; i < heights?.length; i++) {
                let element: HTMLElement | null = document.getElementById('recipes-table-name' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('recipes-table-time' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('recipes-table-categories' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('recipes-table-origin' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('recipes-table-status' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('recipes-table-type' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('recipes-table-kcalPerPortion' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('recipes-table-restrictions' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }
            }

            // Set the heights to the lines
            for (let i = 0; i < heights?.length; i++) {
                let element: HTMLElement | null = document.getElementById('recipes-table-name' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('recipes-table-time' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('recipes-table-categories' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('recipes-table-origin' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('recipes-table-status' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('recipes-table-type' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('recipes-table-kcalPerPortion' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('recipes-table-restrictions' + i);
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

        let names: JSX.Element[] = [<span key="header" className='recipes-table-header' id='recipes-table-name'>Nom</span>];
        let time: JSX.Element[] = [<span key="header" className='recipes-table-header' id='recipes-table-time'>Temps</span>];
        let categories: JSX.Element[] = [<span key="header" className='recipes-table-header' id='recipes-table-categories'>Catégories</span>];
        let origin: JSX.Element[] = [<span key="header" className='recipes-table-header' id='recipes-table-origin'>Origine</span>];
        let status: JSX.Element[] = [<span key="header" className='recipes-table-header' id='recipes-table-status'>Status</span>];
        let type: JSX.Element[] = [<span key="header" className='recipes-table-header' id='recipes-table-type'>Type</span>];
        let kcalPerPortion: JSX.Element[] = [<span key="header" className='recipes-table-header' id='recipes-table-kcal'>Kcal / portion</span>];
        let restrictions: JSX.Element[] = [<span key="header" className='recipes-table-header' id='recipes-table-restrictions'>Restrictions</span>];

        let heights: number[] = [];

        for (let i = 0; i < table?.length; i++) {
            // Names
            {
                names.push(<span
                    key={i}
                    onClick={() => navigate("/food/recipes/" + table[i].name)}
                    className='recipes-table-cell recipes-table-name'
                    id={'recipes-table-name' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    {table[i].name}
                </span>);
            }

            // Time
            {
                let prepHours: number = Math.floor(table[i].preparationTime / 60);
                let prepMinutes: number = table[i].preparationTime % 60;
                let prepTime: string = prepHours > 0 ? prepHours + "h " : "";
                if (prepMinutes > 0) {
                    if (prepMinutes.toString.length === 1 && prepHours !== 0) {
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
                    if (cookMinutes.toString.length === 1 && cookHours !== 0) {
                        cookTime += "0";
                    }
                    cookTime += cookMinutes;
                    cookTime += cookHours === 0 ? " min" : "";
                }
                if (cookTime === "") cookTime = "0 min";

                time.push(<span
                    key={i}
                    className='recipes-table-cell recipes-table-cell-time'
                    id={'recipes-table-time' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
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
                </span>);
            }

            // Categories
            {
                let cellCategories: JSX.Element[] = [];
                for (let j = 0; j < table[i].categories?.length; j++) {
                    cellCategories.push(<span
                        key={j}
                        className='recipes-table-cell-tag'
                        style={{ backgroundColor: "#" + table[i].categories[j]?.color }}
                    >
                        {table[i].categories[j].name}</span>);
                }
                categories.push(<span
                    key={i} className='recipes-table-cell recipes-table-categories' id={'recipes-table-categories' + i}
                    onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}
                >
                    {table[i].categories.length === 0 ? "Aucune" : cellCategories}
                </span>);
            }

            // Origin
            {
                origin.push(<span
                    key={i}
                    className='recipes-table-cell recipes-table-origin'
                    id={'recipes-table-origin' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    <span key={i + "-tag"} className='recipes-table-cell-tag' style={{ backgroundColor: "#" + table[i].origin?.color }}>
                        {table[i].origin.name}</span>
                </span>);
            }

            // Status
            {
                status.push(<span
                    key={i}
                    className='recipes-table-cell recipes-table-status'
                    id={'recipes-table-status' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    <span key={i + "-tag"} className='recipes-table-cell-tag' style={{ backgroundColor: "#" + table[i].status?.color }}>
                        {table[i].status.name}</span>
                </span>);
            }

            // Type
            {
                type.push(<span
                    key={i}
                    className='recipes-table-cell recipes-table-type'
                    id={'recipes-table-type' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    <span key={i + "-tag"} className='recipes-table-cell-tag' style={{ backgroundColor: "#" + table[i].type?.color }}>
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
                    key={i} className='recipes-table-cell' id={'recipes-table-kcalPerPortion' + i}
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

                restrictions.push(<span key={i} className='recipes-table-cell recipes-table-restrictions' id={'recipes-table-restrictions' + i}
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

        htmlTable.push(<Section key={"section-0"} className='recipes-table-col' id="recipes-table-col-name" minSize={100}>{names}</Section>);
        htmlTable.push(<Bar key={"bar-0"} size={1} style={{ cursor: 'col-resize' }} className='recipes-table-bar' />);
        htmlTable.push(<Section key={"section-1"} className='recipes-table-col' minSize={100}>{time}</Section>);
        htmlTable.push(<Bar key={"bar-1"} size={1} style={{ cursor: 'col-resize' }} className='recipes-table-bar' />);
        htmlTable.push(<Section key={"section-2"} className='recipes-table-col' minSize={90}>{categories}</Section>);
        htmlTable.push(<Bar key={"bar-2"} size={1} style={{ cursor: 'col-resize' }} className='recipes-table-bar' />);
        htmlTable.push(<Section key={"section-3"} className='recipes-table-col' minSize={80}>{origin}</Section>);
        htmlTable.push(<Bar key={"bar-3"} size={1} style={{ cursor: 'col-resize' }} className='recipes-table-bar' />);
        htmlTable.push(<Section key={"section-4"} className='recipes-table-col' minSize={60}>{status}</Section>);
        htmlTable.push(<Bar key={"bar-4"} size={1} style={{ cursor: 'col-resize' }} className='recipes-table-bar' />);
        htmlTable.push(<Section key={"section-5"} className='recipes-table-col' minSize={75}>{type}</Section>);
        htmlTable.push(<Bar key={"bar-5"} size={1} style={{ cursor: 'col-resize' }} className='recipes-table-bar' />);
        htmlTable.push(<Section key={"section-6"} className='recipes-table-col' minSize={110}>{kcalPerPortion}</Section>);
        htmlTable.push(<Bar key={"bar-6"} size={1} style={{ cursor: 'col-resize' }} className='recipes-table-bar' />);
        htmlTable.push(<Section key={"section-7"} className='recipes-table-col' minSize={120}>{restrictions}</Section>);

        localStorage.setItem('recipes-table-heights', JSON.stringify(heights));

        return <Container id='recipes-table' onMouseOver={() => setHeights()}>{htmlTable}</Container>
    }

    function createNewRecipe(): void {
        let newIngredient: recipe = {
            _id: '',
            name: '_new',
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
        requester('/ingredients', 'POST', newIngredient).then((res: any) => {
            navigate('/food/recipes/_new')
        });
    }

    return <div id="recipes" className='page recipes-table'>
        <h2>Recettes de la CE Toolbox</h2>
        <button className='recipes-button' onClick={() => { createNewRecipe() }}><div className='recipes-button-content'>Ajouter une Recette</div></button>

        <div className='block-preview'>
            <div id='recipes-table-content' style={{ width: "100%" }}>
                {tableToHtml()}
            </div>
        </div>
        <button className='recipes-button' onClick={() => { createNewRecipe() }}><div className='recipes-button-content'>Ajouter une Recette</div></button>
    </div>
}

export default RecipesList;