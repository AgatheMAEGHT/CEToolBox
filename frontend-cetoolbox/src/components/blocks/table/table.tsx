import React from 'react';

import { Bar, Container, Section } from '@column-resizer/react';

import { blockTable } from '../../types';

import './table.css';

function BlockTable(props: blockTable) {
    const [table, setTable] = React.useState<string[][]>(props.content ? props.content : [[]]);

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>, i: number, j: number) {
        let newValue: string[][] = table;
        newValue[i][j] = event.target.value;
        setTable(newValue);
    }

    function htmlTable(): JSX.Element {
        let htmltable: JSX.Element[] = [];

        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table[i].length; j++) {
                
            }
        }

        return <Container className='block-table'>{table}</Container>
    }

    return (
        <div className='block'>
            <div className='block-preview' style={{ width: "100%" }}>
                <Container className='block-table'>
                    <Section minSize={50}>
                        <p>Oui</p>
                    </Section>
                    <Bar size={1} style={{ cursor: 'col-resize' }} className='block-table-bar' />
                    <Section minSize={100}>
                        <p>Non</p>
                    </Section>
                </Container>
            </div>
        </div>
    );
}

export default BlockTable;