import Link from "next/link"

import { dropdown } from "./_types"

import "./dropdown.css"

export default function Dropdown(props: dropdown) {
    return (
        <div className="header-dropdown">
            {props.items.map(({ path, name }, index) =>
                <Link href={props.page + path} key={index} className="dropdown-item">{name}</Link>
            )}
        </div>
    )
}