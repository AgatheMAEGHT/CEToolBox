import { buttonType } from "./types";

export function button(props: buttonType): JSX.Element {
    if (props.disabled) return <div
        className={'button-border button-border-disabled button-border-disabled-delete'}
        style={props.rounded ? { borderRadius: "100%" } : {}}>
        <div
            className={"button-inside button-inside-disabled-" + props.del}
            style={props.rounded ? { borderRadius: "100%", width: props.width } : { width: props.width }}>
            {props.text}
        </div>
    </div>;

    return <div
        className={'button-border button-border-delete-' + props.del}
        onClick={props.onClick}
        style={props.rounded ? { borderRadius: "100%" } : {}}>
        <div
            className={"button-inside button-inside-delete-" + props.del}
            style={props.rounded ? { borderRadius: "100%", width: props.width } : { width: props.width }}>
            {props.text}
        </div>
    </div>;
}

export function checkbox(bool: boolean, onClick: any): JSX.Element {
    return <div className="checkbox" onClick={onClick}>
        <div className="checkmark-area">
            {bool && <div className="checkmark"></div>}
        </div>
    </div>
}
