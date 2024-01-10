import { buttonType } from "./types";

export function button(props: buttonType): JSX.Element {
    let style: any = {
        width: props.width ?? "initial",
        padding: props.padding ?? "auto",
        borderRadius: props.rounded ? "100%" : "initial"
    };
    let borderClass: string = 'button-border button-border-delete-' + props.del;
    let insideClass: string = 'button-inside button-inside-delete-' + props.del;

    if (props.disabled) {
        borderClass = 'button-border button-border-disabled button-border-disabled-delete';
        insideClass = 'button-inside button-inside-disabled-' + props.del;
    };

    return <div
        className={borderClass}
        onClick={!props.disabled ? (props.onClick ?? (() => { })) : () => { }}
        style={props.rounded ? { borderRadius: "100%" } : {}}>
        <div
            className={insideClass}
            style={style}>
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
