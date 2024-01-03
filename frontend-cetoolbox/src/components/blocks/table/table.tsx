import React from 'react';

import { Bar, Container, Section } from '@column-resizer/react';

import { blockTable } from '../../types';

import './table.css';

function BlockTable(props: blockTable) {
    const [table, setTable] = React.useState<string[][]>(props.content ? props.content : [[]]);
    const [showAdd, setShowAdd] = React.useState<boolean>(false);

    function handleChange(value: string | null, i: number, j: number) {
        let newValue: string[][] = table;
        newValue[i][j] = value ? value : "";
        setTable(newValue);

        // Change the height of the other columns to fit content
        for (let k = 0; k < newValue.length; k++) {
            document.getElementById('block-table-cell' + k + j)?.setAttribute("style", "height: fit-content");
        }

        // Calculate new height
        let height: number = 0;

        for (let k = 0; k < table.length; k++) {
            let h = document.getElementById('block-table-cell' + k + j)?.scrollHeight ?? 0;
            height = height > h ? height : h;
        }

        newValue[1][j] = height.toString();

        // Change the height of the other columns
        for (let k = 0; k < newValue.length; k++) {
            document.getElementById('block-table-cell' + k + j)?.setAttribute("style", "height: " + height + "px");
        }

        setTable(newValue);
    }

    function addCol(): void {
        let newValue: string[][] = table;
        newValue[0].push("100");
        let newCol: string[] = [];

        for (let i = 0; i < table[1].length; i++) {
            newCol.push("");
        }

        newValue.push(newCol);
        setTable(newValue);
    }

    function addRow(): void {
    }

    function tableToHtml(): JSX.Element {
        let htmlTable: JSX.Element[] = [];

        for (let i = 1; i < table.length; i++) {
            let line: JSX.Element[] = [];

            for (let j = 0; j < table[i].length; j++) {
                // eslint-disable-next-line
                line.push(<span
                    key={i + "-" + j}
                    id={'block-table-cell' + i + j}
                    role='textbox'
                    className='block-table-cell'
                    contentEditable
                    onInput={e => handleChange(e.currentTarget.innerText, i, j)}
                    style={{ minHeight: "fit-content", height: table[1][j] + "px" }}
                >
                    {table[i][j]}
                </span>);
            }

            htmlTable.push(<Section key={i} className='block-table-col' minSize={parseInt(table[0][i - 1])}>{line}</Section>);
            { i < table.length - 1 && htmlTable.push(<Bar key={i + "bar"} size={1} style={{ cursor: 'col-resize' }} className='block-table-bar' />) };
        }

        return <Container className='block-table'>{htmlTable}</Container>
    }

    return (
        <div className='block'>
            <div className='block-preview' style={{ width: "100%" }}>
                <div className='block-table-add-area'>
                    <div className='block-table-add-col-area'>
                        {tableToHtml()}
                        <div id="block-table-add-col" onClick={() => addCol()}><p className='block-table-add-elt'><b>+</b></p></div>
                    </div>
                    <div id="block-table-add-row"><p className='block-table-add-elt'><b>+</b></p></div>
                </div>
            </div>
        </div>
    );
}

export default BlockTable;