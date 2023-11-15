import React from 'react';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex'

import { blockText } from '../../types';

import './text.css';

function BlockText(props: blockText) {
    const [value, setValue] = React.useState<string | undefined>(``);
    const [showText, setShowText] = React.useState<boolean>(false);

    return (
        <div className='block'>
            {showText && <textarea className='block-text-text' value={value} onChange={(e) => setValue(e.target.value)} />}
            <div className='block-text-preview' style={showText ? { width: "50%" } : { width: "100%" }}>
                <div id='block-icons'>
                    <img alt="double-arrow" className="block-icon" src='/double-arrow.svg' style={showText ? {} : { transform: "rotate(180deg)" }} onClick={() => setShowText(!showText)} />
                    <img alt="bin" className="block-icon" src='/bin.png' onClick={() => { props.delete(props.id) }} />
                </div>
                <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, [rehypeHighlight, { fragment: true }], [rehypeRaw, { allowDangerousHtml: true }]]}>{value}</Markdown>
            </div>
        </div>
    );
}

export default BlockText;