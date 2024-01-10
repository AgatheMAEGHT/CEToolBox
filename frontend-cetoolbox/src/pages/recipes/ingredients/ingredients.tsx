import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Bar, Container, Section } from '@column-resizer/react';

import { ingredient, ingredientDB } from '../../../components/types';
import { requester } from '../../../components/requester';
import './ingredients.css';

function Ingredients() {
    let navigate = useNavigate();

    const [table, setTable] = React.useState<ingredient[]>([]);

    React.useEffect(() => {
        // Get the ingredient from the database
        requester('/ingredients?populate=true', 'GET', null).then((res: any) => {
            setTable(res);
        });

        // Get the tags from the database
        requester('/ingredient-tags', 'GET').then((res: any) => {
            if (res === null) return;
            //setTags(res);
        });
    }, []);

    // Change the color of the line in the table
    function changeColor(i: number, select: boolean): void {
        let element: HTMLElement | null = document.getElementById('table-list-cell-name' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-cell-tags' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-cell-kcalPerGram' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-cell-restrictions' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }

        element = document.getElementById('table-list-cell-toGramFactor' + i);
        if (element) {
            select ? element.style.backgroundColor = 'transparent' : element.style.backgroundColor = 'var(--background)';
        }
    }

    // Set the heights of the lines for the first time
    React.useEffect(() => {
        setHeights();
    }, [table]);

    function setHeights(): void {
        let heights: number[] = JSON.parse(localStorage.getItem('table-list-heights') || '[]');

        // If headers width changed
        let headerNames: number = document.getElementById('table-list-cell-name')?.offsetWidth ?? 0;
        let headerTags: number = document.getElementById('table-list-cell-tags')?.offsetWidth ?? 0;
        let headerKcalPerGram: number = document.getElementById('table-list-cell-kcalPerGram')?.offsetWidth ?? 0;
        let headerRestrictions: number = document.getElementById('table-list-cell-restrictions')?.offsetWidth ?? 0;
        let headerToGramFactor: number = document.getElementById('table-list-cell-toGramFactor')?.offsetWidth ?? 0;

        if (headerNames !== heights[0] || headerTags !== heights[1] || headerKcalPerGram !== heights[2] || headerRestrictions !== heights[3] || headerToGramFactor !== heights[4]) {
            // Get the heights of the lines
            for (let i = 0; i < heights?.length; i++) {
                let element: HTMLElement | null = document.getElementById('table-list-cell-name' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-cell-tags' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-cell-kcalPerGram' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-cell-restrictions' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }

                element = document.getElementById('table-list-cell-toGramFactor' + i);
                if (element) {
                    element.style.height = 'fit-content'
                    heights[i] = (heights[i] < element.offsetHeight ? element.offsetHeight : heights[i]);
                }
            }

            // Set the heights to the lines
            for (let i = 0; i < heights?.length; i++) {
                let element: HTMLElement | null = document.getElementById('table-list-cell-name' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-cell-tags' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-cell-kcalPerGram' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-cell-restrictions' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }

                element = document.getElementById('table-list-cell-toGramFactor' + i);
                if (element) {
                    element.style.height = heights[i] - 1 + 'px';
                }
            }
        }
    }

    function tableToHtml(): JSX.Element {
        let htmlTable: JSX.Element[] = [];

        let names: JSX.Element[] = [<span key="header" className='table-list-header' id='table-list-name'>Nom</span>];
        let tags: JSX.Element[] = [<span key="header" className='table-list-header'>Tags</span>];
        let kcalPerGram: JSX.Element[] = [<span key="header" className='table-list-header'>Kcal / g</span>];
        let restrictions: JSX.Element[] = [<span key="header" className='table-list-header'>Restrictions</span>];
        let toGramFactor: JSX.Element[] = [<span key="header" className='table-list-header'>To gram factor</span>];

        let heights: number[] = [];

        for (let i = 0; i < table?.length; i++) {
            // Names
            {
                names.push(<span
                    key={i}
                    onClick={() => navigate("/food/ingredients/" + table[i].name)}
                    className='table-list-cell table-list-cell-name'
                    id={'table-list-name' + i}
                    onMouseOut={() => changeColor(i, false)}
                    onMouseOver={() => changeColor(i, true)}
                >
                    {table[i].name}
                </span>);
            }

            // Tags
            {
                let cellTags: JSX.Element[] = [];
                for (let j = 0; j < table[i].tags?.length; j++) {
                    cellTags.push(<span key={j} className='table-list-cell-tag' style={{ backgroundColor: "#" + table[i].tags[j]?.color }}>
                        {table[i].tags[j].name}</span>);
                }
                tags.push(<span
                    key={i} className='table-list-cell table-list-cell-tags' id={'table-list-cell-tags' + i}
                    onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                    {table[i].tags.length === 0 ? "Aucun" : cellTags}
                </span>);
            }

            // kcalPerGram
            {
                kcalPerGram.push(<span
                    key={i} className='table-list-cell' id={'table-list-cell-kcalPerGram' + i}
                    onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                    {table[i].kcalPerGram}
                </span>);
            }

            // restrictions
            {
                restrictions.push(<span key={i} className='table-list-cell' id={'table-list-cell-restrictions' + i}
                    onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}>
                    {table[i].restrictions.isVegan ? "Vegan" : ""}
                    {table[i].restrictions.isVeggie ? "Veggie" : ""}
                    {table[i].restrictions.isGlutenFree ? "GlutenFree" : ""}
                    {table[i].restrictions.isCheeseFree ? "CheeseFree" : ""}
                    {table[i].restrictions.isFishFree ? "FishFree" : ""}
                    {!table[i].restrictions.isVegan && !table[i].restrictions.isVeggie && !table[i].restrictions.isGlutenFree &&
                        !table[i].restrictions.isCheeseFree && !table[i].restrictions.isFishFree ? "Aucune" : ""}
                </span>);
            }

            // toGramFactor
            {
                toGramFactor.push(<span key={i}
                    className='table-list-cell' id={'table-list-cell-toGramFactor' + i}
                    onMouseOut={() => changeColor(i, false)} onMouseOver={() => changeColor(i, true)}
                >
                    {table[i].toGramFactor}
                </span>);
            }

            //Heights
            heights.push(0);
        }

        htmlTable.push(<Section key={"section-0"} className='table-list-col' minSize={100}>{names}</Section>);
        htmlTable.push(<Bar key={"bar-0"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-1"} className='table-list-col' minSize={100}>{tags}</Section>);
        htmlTable.push(<Bar key={"bar-1"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-2"} className='table-list-col' minSize={100}>{kcalPerGram}</Section>);
        htmlTable.push(<Bar key={"bar-2"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-3"} className='table-list-col' minSize={100}>{restrictions}</Section>);
        htmlTable.push(<Bar key={"bar-3"} size={1} style={{ cursor: 'col-resize' }} />);
        htmlTable.push(<Section key={"section-4"} className='table-list-col' minSize={120}>{toGramFactor}</Section>);

        localStorage.setItem('table-list-heights', JSON.stringify(heights));

        return <Container id='table-list' onMouseOver={() => setHeights()}>{htmlTable}</Container>
    }

    function createNewIngredient(): void {
        let newIngredient: ingredientDB = {
            _id: '',
            name: '_new',
            tags: [],
            kcalPerGram: 0,
            toGramFactor: 1,
            restrictions: {
                isVegan: false,
                isVeggie: false,
                isGlutenFree: false,
                isCheeseFree: false,
                isFishFree: false
            }
        }
        requester('/ingredients', 'POST', newIngredient).then((res: any) => {
            navigate('/food/ingredients/_new')
        });
    }

    return <div id="ingredients" className='page'>
        <h2>Ingrédients de la CE Toolbox</h2>
        <button className='recipes-button' onClick={() => { createNewIngredient() }}><div className='recipes-button-content'>Ajouter un ingrédient</div></button>

        <div className='block-preview'>
            <div id='table-list-content' style={{ width: "100%" }}>
                {tableToHtml()}
            </div>
        </div>
        <button className='recipes-button' onClick={() => { navigate('/food/ingredients/new') }}><div className='recipes-button-content'>Ajouter un ingrédient</div></button>
    </div>
}

export default Ingredients;