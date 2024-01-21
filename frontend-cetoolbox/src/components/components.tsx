import React from "react";
import { buttonType, dragAndDropType } from "./types";

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

export function DragAndDrop(props: dragAndDropType): JSX.Element {
    const [ddList, setDdList] = React.useState(document.getElementById("ddlist" + props.id));

    React.useEffect(() => {
        setDdList(document.getElementById("ddlist" + props.id));
    }, []);

    let queryStr = ".ddelt" + props.id + ":not(.dragging)";

    return <div id={"ddlist" + props.id}
        className={props.areaClassName}
        onDragOver={(e) => {
            e.preventDefault();
            const drag = ddList?.querySelector(".dragging");
            if (drag === null || drag === undefined) { return; }
            const sib = ddList?.querySelectorAll(queryStr);
            if (sib === null || sib === undefined) { return; }
            const siblings = Array.from(sib);

            let nextSibling = siblings.find(sibling => {
                return e.clientY < sibling.getBoundingClientRect().top + sibling.getBoundingClientRect().height / 2;
            })
            if (nextSibling === undefined || nextSibling === null) { return; }

            ddList?.insertBefore(drag, nextSibling);
        }}
    >
        {props.content.map((element: JSX.Element, index) => {
            return <div
                className={"ddelt" + props.id}
                key={index}
                id={"ddelt" + props.id + "-" + index}
                draggable
                onDragStart={() => { document.getElementById("ddelt" + props.id + "-" + index)?.classList.add("dragging") }}
                onDragEnd={() => { document.getElementById("ddelt" + props.id + "-" + index)?.classList.remove("dragging") }}
            >
                {element}
            </div>
        })}
    </div>;
}
