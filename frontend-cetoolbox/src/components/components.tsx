export function button(text: string, onClick: any, del?: boolean): JSX.Element {
    return <div className={'button-border button-border-delete-' + del} onClick={onClick}><div className={"button-inside button-inside-delete-" + del}>{text}</div></div>;
}

export function checkbox(bool: boolean, onClick: any): JSX.Element {
    return <div className="checkbox" onClick={onClick}>
        <div className="checkmark-area">
            {bool && <div className="checkmark"></div>}
        </div>
    </div>
}
