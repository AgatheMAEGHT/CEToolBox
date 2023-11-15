import React from 'react';

import './katex.css';

function BlockKatex() {
    const [value, setValue] = React.useState<string | undefined>(``);
    const [showText, setShowText] = React.useState<boolean>(false);

    return (
        <div className='block'>
            {showText && <textarea className='block-text-text' value={value} onChange={(e) => setValue(e.target.value)} />}
            <div className='block-text-preview' style={showText ? { width: "50%" } : {}}>
                <img alt="double-arrow" className="block-hide-arrow" src='/double-arrow.svg' style={showText ? {} : { transform: "rotate(180deg)" }} onClick={() => setShowText(!showText)} />
            </div>
        </div>
    );
}

export default BlockKatex;