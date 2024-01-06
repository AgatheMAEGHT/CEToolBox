import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Bar, Container, Section } from '@column-resizer/react';

import './ingredients.css';
import { ingredient } from '../../../components/types';

function Ingredients() {
    let navigate = useNavigate();

    let temp: ingredient[] = [
        {
            _id: "",
            name: 'Oui et parfois non et meme ça dépend',
            tags: [{ name: "Tag 1", color: "fff123" }, { name: "Tag 2", color: "789456" }],
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
            _id: "",
            name: 'Oui',
            tags: [{ name: "Tag 1", color: "fff123" }],
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

    // Set the heights of the lines for the first time
    React.useEffect(() => {
        setHeights();
    }, [table]);

    function setHeights(): void {
        let heights: number[] = JSON.parse(localStorage.getItem('recipes-ingredients-table-heights') || '[]');

        // If headers width changed
        let headerNames: number = document.getElementById('recipes-ingredients-table-name')?.offsetWidth ?? 0;
        let headerTags: number = document.getElementById('recipes-ingredients-table-tags')?.offsetWidth ?? 0;
        let headerKcalPerGram: number = document.getElementById('recipes-ingredients-table-kcalPerGram')?.offsetWidth ?? 0;
        let headerRestrictions: number = document.getElementById('recipes-ingredients-table-restrictions')?.offsetWidth ?? 0;
        let headerToGramFactor: number = document.getElementById('recipes-ingredients-table-toGramFactor')?.offsetWidth ?? 0;

        if (headerNames !== heights[0] || headerTags !== heights[1] || headerKcalPerGram !== heights[2] || headerRestrictions !== heights[3] || headerToGramFactor !== heights[4]) {
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
    }

    function tableToHtml(): JSX.Element {
        let htmlTable: JSX.Element[] = [];

        // Names
        let names: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header' id='recipes-ingredients-table-name'>Nom</span>];
        for (let i = 0; i < table.length; i++) {
            names.push(<span
                key={i}
                onClick={() => navigate("/recipes/ingredients/" + table[i].name)}
                className='recipes-ingredients-table-cell recipes-ingredients-table-name'
                id={'recipes-ingredients-table-name' + i}
                onMouseOut={() => changeColor(i, false)}
                onMouseOver={() => changeColor(i, true)}
            >
                {table[i].name}
            </span>);
        }
        htmlTable.push(<Section key={"section-0"} className='recipes-ingredients-table-col' minSize={100}>{names}</Section>);
        htmlTable.push(<Bar key={"bar-0"} size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />);

        // Tags
        let tags: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header'>Tags</span>];
        for (let i = 0; i < table.length; i++) {
            let cellTags: JSX.Element[] = [];
            for (let j = 0; j < table[i].tags.length; j++) {
                cellTags.push(<span key={j} className='recipes-ingredients-table-cell-tag' style={{ backgroundColor: "#" + table[i].tags[j].color }}>
                    {table[i].tags[j].name}</span>);
            }
            tags.push(<span
                key={i} className='recipes-ingredients-table-cell recipes-ingredients-table-tags' id={'recipes-ingredients-table-tags' + i}
                onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                {table[i].tags.length === 0 ? "Aucun" : cellTags}
            </span>);
        }
        htmlTable.push(<Section key={"section-1"} className='recipes-ingredients-table-col' minSize={100}>{tags}</Section>);
        htmlTable.push(<Bar key={"bar-1"} size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />);

        // kcalPerGram
        let kcalPerGram: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header'>Kcal / g</span>];
        for (let i = 0; i < table.length; i++) {
            kcalPerGram.push(<span
                key={i} className='recipes-ingredients-table-cell' id={'recipes-ingredients-table-kcalPerGram' + i}
                onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                {table[i].kcalPerGram}
            </span>);
        }
        htmlTable.push(<Section key={"section-2"} className='recipes-ingredients-table-col' minSize={100}>{kcalPerGram}</Section>);
        htmlTable.push(<Bar key={"bar-2"} size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />);

        // restrictions
        let restrictions: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header'>Restrictions</span>];
        for (let i = 0; i < table.length; i++) {
            restrictions.push(<span key={i} className='recipes-ingredients-table-cell' id={'recipes-ingredients-table-restrictions' + i}
                onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                {table[i].restrictions.vegan ? "Vegan" : ""}
                {table[i].restrictions.vegetarian ? "Veggie" : ""}
                {table[i].restrictions.glutenFree ? "GlutenFree" : ""}
                {table[i].restrictions.cheeseFree ? "CheeseFree" : ""}
                {table[i].restrictions.fishFree ? "FishFree" : ""}
                {!table[i].restrictions.vegan && !table[i].restrictions.vegetarian && !table[i].restrictions.glutenFree &&
                    !table[i].restrictions.cheeseFree && !table[i].restrictions.fishFree ? "Aucune" : ""}
            </span>);
        }
        htmlTable.push(<Section key={"section-3"} className='recipes-ingredients-table-col' minSize={100}>{restrictions}</Section>);
        htmlTable.push(<Bar key={"bar-3"} size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />);

        // toGramFactor
        let toGramFactor: JSX.Element[] = [<span key="header" className='recipes-ingredients-table-header'>To gram factor</span>];
        for (let i = 0; i < table.length; i++) {
            toGramFactor.push(<span key={i} className='recipes-ingredients-table-cell' id={'recipes-ingredients-table-toGramFactor' + i}
                onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                {table[i].toGramFactor}</span>);
        }
        htmlTable.push(<Section key={"section-4"} className='recipes-ingredients-table-col' minSize={120}>{toGramFactor}</Section>);

        //Heights
        let heights: number[] = [];
        for (let i = 0; i < table.length; i++) {
            heights.push(0);
        }
        localStorage.setItem('recipes-ingredients-table-heights', JSON.stringify(heights));

        return <Container id='recipes-ingredients-table' onMouseOver={() => setHeights()}>{htmlTable}</Container>
    }

    return <div id="recipes" className='page'>
        <h2>Ingrédients de la CE Toolbox</h2>
        <button className='recipes-button' onClick={() => { navigate('/recipes/ingredients/new') }}><div className='recipes-button-content'>Ajouter un ingrédient</div></button>

        <div className='block-preview'>
            <div id='recipes-ingredients-table-content' style={{ width: "100%" }}>
                {tableToHtml()}
            </div>
        </div>
        <button className='recipes-button' onClick={() => { navigate('/recipes/ingredients/new') }}><div className='recipes-button-content'>Ajouter un ingrédient</div></button>
    </div>
}

export default Ingredients;