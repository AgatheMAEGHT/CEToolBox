import Link from "next/link"

import Dropdown from "./dropdown"

import "./header.css"

export default function Header() {

    const house = [
        { path: "items", name: "Items" }
    ];

    const mods = [
        { path: "civ6", name: "Civilisation 6" },
        { path: "sims4", name: "The Sims 4" }
    ];

    return (
        <div id="header">
            <div id="header-buttons-area">
                <Link href="/" className="header-button">
                    Home
                </Link>

                <div className="header-button-area">
                    <Link href="/house" className="header-button">House</Link >
                    <div id="dropdown-arrow"><i className="arrow arrow-down"></i></div>
                    <Dropdown page="/house/" items={house} />
                </div>

                <div className="header-button-area">
                    <Link href="/mods" className="header-button">Mods</Link >
                    <div id="dropdown-arrow"><i className="arrow arrow-down"></i></div>
                    <Dropdown page="/mods/" items={mods} />
                </div>
            </div>
        </div>
    )
}