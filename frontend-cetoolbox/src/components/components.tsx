export function button(text: string, onClick: any) {
    return <div className='button-border' onClick={onClick}><div className="button-inside">{text}</div></div>;
}

export function checkbox(bool: boolean, onClick: any): JSX.Element {
    return <div className="checkbox" onClick={onClick}>
        <div className="checkmark-area">
            {bool && <div className="checkmark"></div>}
        </div>
    </div>
}
