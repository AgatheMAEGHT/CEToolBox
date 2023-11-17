import React from 'react';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

import { blockKatex } from '../../types';

import './katex.css';

function BlockKatex(props: blockKatex) {
    const [value, setValue] = React.useState<string | undefined>(props.content);
    const [showText, setShowText] = React.useState<boolean>(false);

    return (
        <div className='block'>
            {showText && <textarea className='block-text' value={value} onChange={(e) => setValue(e.target.value)} />}
            <div className='block-preview' style={showText ? { width: "50%" } : {}}>
                <div className='block-icon-area'>
                    <img alt="double-arrow" className="block-icon block-icon-arrow" src='/double-arrow.svg' style={showText ? {} : { transform: "rotate(180deg)" }} onClick={() => setShowText(!showText)} />
                </div>
                <div>
                    <BlockMath>{value}</BlockMath>
                </div>
            </div>
        </div>
    );
}

export default BlockKatex;