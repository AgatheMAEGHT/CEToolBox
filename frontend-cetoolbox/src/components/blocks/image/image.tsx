import React from 'react';

import { blockImage } from '../../types';

import './image.css';

function BlockImage(props: blockImage) {
    const [value, setValue] = React.useState<string | undefined>(props.content);
    const [size, setSize] = React.useState<string | undefined>(props.size);
    const [align, setAlign] = React.useState<string | undefined>(props.align);
    const [showText, setShowText] = React.useState<boolean>(false);

    return (
        <div className='block'>
            {showText && <div className='block-image-elt-area'>
                <textarea className='block-image-elt' id="block-image-elt-top" placeholder='path' value={value} onChange={(e) => setValue(e.target.value)} />
                <textarea className='block-image-elt' placeholder='size' value={size} onChange={(e) => setSize(e.target.value)} />
                <div id="block-image-align">
                    <div>Aligner</div>
                    <select className='block-image-elt' value={align} onChange={(e) => setAlign(e.target.value)}>
                        <option value="left">gauche</option>
                        <option value="center">milieu</option>
                        <option value="right">droite</option>
                    </select>
                </div>
            </div>}
            <div className='block-preview' style={showText ? { width: "50%" } : { width: "100%" }}>
                <div className='block-icon-area'>
                    <img alt="double-arrow" className="block-icon block-icon-arrow" src='/double-arrow.svg' style={showText ? {} : { transform: "rotate(180deg)" }} onClick={() => setShowText(!showText)} />
                </div>
                <div className='block-image' style={{ justifyContent: align }}>
                    <img alt={value} className="block-image" src={value} style={{ width: size }} />
                </div>
            </div>
        </div>
    );
}

export default BlockImage;