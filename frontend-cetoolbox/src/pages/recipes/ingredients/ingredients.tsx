import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Bar, Container, Section } from '@column-resizer/react';

import './ingredients.css';

function Ingredients() {
    let navigate = useNavigate();

    /* TEST */
    let test: string[][] = [
        ["100", "150", "200", "150"],
        ["30", "30", "21", "50", "21"],
        [`Nom`, `a`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`],
        [`Kcal / 1g`, `3`, `50`, `12`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`],
        [`da`, `e`, `f`, "block", `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`],
        [`g`, `h`, `i`, "bluck", `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`, `b`, `c`]
    ];
    /* END TEST */

    const [table, setTable] = React.useState<string[][]>(test ? test : [[]]);

    function handleChange(value: string | null, i: number, j: number) {
        let newValue: string[][] = table;
        newValue[i][j] = value ? value : "";
        setTable(newValue);

        // Change the height of the other columns to fit content
        for (let k = 0; k < newValue.length; k++) {
            document.getElementById('recipes-ingredients-table-cell' + k + j)?.setAttribute("style", "height: fit-content");
        }

        // Calculate new height
        let height: number = 0;

        for (let k = 0; k < table.length; k++) {
            let h = document.getElementById('recipes-ingredients-table-cell' + k + j)?.scrollHeight ?? 0;
            height = height > h ? height : h;
        }

        newValue[1][j] = height.toString();

        // Change the height of the other columns
        for (let k = 0; k < newValue.length; k++) {
            document.getElementById('recipes-ingredients-table-cell' + k + j)?.setAttribute("style", "height: " + height + "px");
        }

        setTable(newValue);
    }

    function addCol(): void {
        let newValue: string[][] = table;
        newValue[0].push("100");

        // input the new column name
        let newColName: string = prompt("Nom de la nouvelle colonne :") ?? "";
        let newCol: string[] = [];

        for (let i = 0; i < newValue[newValue.length - 1].length; i++) {
            newCol.push("");
        }
        newCol[0] = newColName;
        newValue.push(newCol);

        setTable(newValue);
    }

    function addRow(): void {
        let newTable: string[][] = table;
        newTable[1].push("21");

        for (let i = 0; i < newTable.length; i++) {
            newTable[i].push("");
        }

        setTable(newTable);
    }

    function changeColor(j: number, enter: boolean): void {
        if (j < 1) {
            return;
        }
        for (let i = 0; i < table.length; i++) {
            let elt = document.getElementById('recipes-ingredients-table-cell' + i + j) ?? undefined;
            if (elt) {
                elt.style.backgroundColor = enter ? "transparent" : "white";
            }
        }
    }

    function tableToHtml(): JSX.Element {
        let htmlTable: JSX.Element[] = [];

        for (let i = 2; i < table.length; i++) {
            let column: JSX.Element[] = [];

            for (let j = 0; j < table[i].length; j++) {
                // eslint-disable-next-line
                column.push(<span
                    key={i + "-" + j}
                    id={'recipes-ingredients-table-cell' + i + j}
                    role='textbox'
                    className={'recipes-ingredients-table-cell recipes-ingredients-table-row-' + j}
                    contentEditable
                    onInput={e => handleChange(e.currentTarget.innerText, i, j)}
                    style={{ minHeight: "fit-content", height: table[1][j] + "px", minWidth: "20px" }}
                    onMouseOver={() => changeColor(j, true)}
                    onMouseOut={() => changeColor(j, false)}
                >
                    {table[i][j]}
                </span>);
            }

            htmlTable.push(<Section key={i} className='recipes-ingredients-table-col' minSize={parseInt(table[0][i - 1])}>{column}</Section>);
            { i < table.length - 1 && htmlTable.push(<Bar key={i + "bar"} size={1} style={{ cursor: 'col-resize' }} className='recipes-ingredients-table-bar' />) };
        }

        return <Container id='recipes-ingredients-table'>{htmlTable}</Container>
    }

    return <div id="recipes" className='page'>
        <h2>Ingrédients de la CE Toolbox</h2>
        <button className='recipes-button' onClick={() => { addRow() }}><div className='recipes-button-content'>Ajouter un ingrédient</div></button>
        <button className='recipes-button' onClick={() => { addCol() }}><div className='recipes-button-content'>Ajouter une colone</div></button>

        <div className='block-preview'>
            <div id='recipes-ingredients-table-content' style={{ width: "100%" }}>
                {tableToHtml()}
            </div>
        </div>
        <button className='recipes-button' onClick={() => { addRow() }}><div className='recipes-button-content'>Ajouter un ingrédient</div></button>
    </div>
}

export default Ingredients;