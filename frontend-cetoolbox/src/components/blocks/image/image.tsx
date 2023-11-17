import React from 'react';

import Markdown from 'react-markdown'; // to display markdown
import remarkGfm from 'remark-gfm'; // to allow tables in markdown
import rehypeKatex from 'rehype-katex'; // to allow katex in markdown
import rehypeRaw from 'rehype-raw'; // to allow html in markdown

import { blockImage } from '../../types';

import './image.css';

function BlockImage(props: blockImage) {
    const [value, setValue] = React.useState<string | undefined>(props.content);
    const [size, setSize] = React.useState<string | undefined>(props.size);
    const [align, setAlign] = React.useState<string | undefined>(props.size);
    const [showText, setShowText] = React.useState<boolean>(false);

    return (
        <div className='block'>
            {showText && <div className='block-image-elt-area'>
                <textarea className='block-image-elt' placeholder='path' value={value} onChange={(e) => setValue(e.target.value)} />
                <textarea className='block-image-elt' placeholder='size' value={size} onChange={(e) => setSize(e.target.value)} />
                <select className='block-image-elt' value={align} onChange={(e) => setAlign(e.target.value)}>
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                </select>
            </div>}
            <div className='block-preview' style={showText ? { width: "50%" } : { width: "100%" }}>
                <div className='block-icon-area'>
                    <img alt="double-arrow" className="block-icon block-icon-arrow" src='/double-arrow.svg' style={showText ? {} : { transform: "rotate(180deg)" }} onClick={() => setShowText(!showText)} />
                </div>
                <div className='block-image' style={{ justifyContent: align }}>
                    <img alt="image" className="block-image" src={value} style={{ width: size }} />
                </div>
            </div>
        </div>
    );
}

export default BlockImage;