import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Bar, Container, Section } from '@column-resizer/react';

import './ingredients.css';
import { ingredient } from '../../../components/types';

function Ingredients() {
    let navigate = useNavigate();

    let temp: ingredient[] = [
        {
            name: 'Oui et parfois non et meme ça dépend',
            tags: ["/"],
            kcalPerGram: 0,
            toGramFactor: 0,
            restrictions: {
                vegan: false,
                vegetarian: false,
                glutenFree: false,
                cheeseFree: false,
                fishFree: false
            }
        },
        {
            name: 'Oui',
            tags: ["/"],
            kcalPerGram: 0,
            toGramFactor: 0,
            restrictions: {
                vegan: false,
                vegetarian: false,
                glutenFree: false,
                cheeseFree: false,
                fishFree: false
            }
        }
    ];

    React.useEffect(() => {
        // Get the ingredient from the database
    },);
    const [table, setTable] = React.useState<ingredient[]>(temp);

    // Change the color of the line in the table
    function changeColor(i: number, select: boolean): void {
        let element: HTMLElement | null = document.getElementById('recipes-ingredients-table-name' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-ingredients-table-tags' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-ingredients-table-kcalPerGram' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-ingredients-table-restrictions' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('recipes-ingredients-table-toGramFactor' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }
    }

    React.useEffect(() => {
        setHeights();
    }, [table]);

    function setHeights(): void {
        let heights: number[] = JSON.parse(localStorage.getItem('recipes-ingredients-table-heights') || '[]');

        // Get the heights of the lines
        for (let i = 0; i < heights.length; i++) {
            let element: HTMLElement | null = document.getElementById('recipes-ingredients-table-name' + i);
            if (element) {
                element.style.height = 'fit-content'
                heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
            }

            element = document.getElementById('recipes-ingredients-table-tags' + i);
            if (element) {
                element.style.height = 'fit-content'
                heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
            }

            element = document.getElementById('recipes-ingredients-table-kcalPerGram' + i);
            if (element) {
                element.style.height = 'fit-content'
                heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
            }

            element = document.getElementById('recipes-ingredients-table-restrictions' + i);
            if (element) {
                element.style.height = 'fit-content'
                heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
            }

            element = document.getElementById('recipes-ingredients-table-toGramFactor' + i);
            if (element) {
                element.style.height = 'fit-content'
                heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
            }
        }

        // Set the heights to the lines
        for (let i = 0; i < heights.length; i++) {
            let element: HTMLElement | null = document.getElementById('recipes-ingredients-table-name' + i);
            if (element) {
                element.style.height = heights[i] - 1 + 'px';
            }

            element = document.getElementById('recipes-ingredients-table-tags' + i);
            if (element) {
                element.style.height = heights[i] - 1 + 'px';
            }

            element = document.getElementById('recipes-ingredients-table-kcalPerGram' + i);
            if (element) {
                element.style.height = heights[i] - 1 + 'px';
            }

            element = document.getElementById('recipes-ingredients-table-restrictions' + i);
            if (element) {
                element.style.height = heights[i] - 1 + 'px';
            }

            element = document.getElementById('recipes-ingredients-table-toGramFactor' + i);
            if (element) {
                element.style.height = heights[i] - 1 + 'px';
            }
        }
    }

    function tableToHtml(): JSX.Element {
        let htmlTable: JSX.Element[] = [];

        // Names
        let names: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header' id='recipes-ingredients-table-name'>Nom</span>];
        for (let i = 0; i < table.length; i++) {
            names.push(<span key={i} className='recipes-ingredients-table-cell' id={'recipes-ingredients-table-name' + i} onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>{table[i].name}</span>);
        }
        htmlTable.push(<Section className='recipes-ingredients-table-col' minSize={100}>{names}</Section>);
        htmlTable.push(<Bar size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />);

        // Tags
        let tags: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header'>Tags</span>];
        for (let i = 0; i < table.length; i++) {
            tags.push(<span key={i} className='recipes-ingredients-table-cell' id={'recipes-ingredients-table-tags' + i} onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>{table[i].tags}</span>);
        }
        htmlTable.push(<Section className='recipes-ingredients-table-col' minSize={100}>{tags}</Section>);
        htmlTable.push(<Bar size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />);

        // kcalPerGram
        let kcalPerGram: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header'>Kcal / g</span>];
        for (let i = 0; i < table.length; i++) {
            kcalPerGram.push(<span key={i} className='recipes-ingredients-table-cell' id={'recipes-ingredients-table-kcalPerGram' + i} onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>{table[i].kcalPerGram}</span>);
        }
        htmlTable.push(<Section className='recipes-ingredients-table-col' minSize={100}>{kcalPerGram}</Section>);
        htmlTable.push(<Bar size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />);

        // restrictions
        let restrictions: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header'>Restrictions</span>];
        for (let i = 0; i < table.length; i++) {
            restrictions.push(<span key={i} className='recipes-ingredients-table-cell' id={'recipes-ingredients-table-restrictions' + i} onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                {table[i].restrictions.vegan ? "Vegan" : ""}
                {table[i].restrictions.vegetarian ? "Veggie" : ""}
                {table[i].restrictions.glutenFree ? "GlutenFree" : ""}
                {table[i].restrictions.cheeseFree ? "CheeseFree" : ""}
                {table[i].restrictions.fishFree ? "FishFree" : ""}
                {!table[i].restrictions.vegan && !table[i].restrictions.vegetarian && !table[i].restrictions.glutenFree && !table[i].restrictions.cheeseFree && !table[i].restrictions.fishFree ? "Aucune" : ""}
            </span>);
        }
        htmlTable.push(<Section className='recipes-ingredients-table-col' minSize={100}>{restrictions}</Section>);
        htmlTable.push(<Bar size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />);

        // toGramFactor
        let toGramFactor: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header'>To gram factor</span>];
        for (let i = 0; i < table.length; i++) {
            toGramFactor.push(<span key={i} className='recipes-ingredients-table-cell' id={'recipes-ingredients-table-toGramFactor' + i} onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>{table[i].toGramFactor}</span>);
        }
        htmlTable.push(<Section className='recipes-ingredients-table-col' minSize={120}>{toGramFactor}</Section>);

        //Heights
        let heights: number[] = [];
        for (let i = 0; i < table.length; i++) {
            heights.push(0);
        }
        localStorage.setItem('recipes-ingredients-table-heights', JSON.stringify(heights));

        return <Container id='recipes-ingredients-table' onClick={() => setHeights()}>{htmlTable}</Container>
    }

    return <div id="recipes" className='page'>
        <h2>Ingrédients de la CE Toolbox</h2>
        <button className='recipes-button' onClick={() => { navigate('/recipes/ingredients/new') }}><div className='recipes-button-content'>Ajouter un ingrédient</div></button>

        <div className='block-preview'>
            <div id='recipes-ingredients-table-content' style={{ width: "100%" }} onClick={() => setHeights()}>
                {tableToHtml()}
            </div>
        </div>
        <button className='recipes-button' onClick={() => { navigate('/recipes/ingredients/new') }}><div className='recipes-button-content'>Ajouter un ingrédient</div></button>
    </div>
}

export default Ingredients;