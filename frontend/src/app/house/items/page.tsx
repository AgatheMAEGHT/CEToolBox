"use client"

import React from 'react';
import Link from "next/link";
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';

import bin from "../../../../public/icons/bin.png"
import { item } from "./_types";

import "./items.css";

export default function Items() {
    const [displayAdd, setDisplayAdd] = React.useState(false);

    // Call to database
    const categories: string[] = ["All", "Chambre", "Salon", "Salle de bain"];

    function deleteItem(name: string, category: string, quantity: number, description: string) {
        // CALL TO DELETE IN DATABASE with only id
    }

    function createItem(name: string, category: string, quantity: number, description: string) {
        // CALL TO CREATE IN DATABASE
        const res = 200;
        if (res === 200) {
            setDisplayAdd(false)
        }
    }

    // Selected category
    let getselectedCateg: string | null = useSearchParams().get("category");
    if (getselectedCateg === null) {
        getselectedCateg = "All";
    }
    const selectedCateg = getselectedCateg;

    // Items list
    const items: item[] = [
        { name: "truc1", category: "Chambre", quantity: 5, description: "Un super truc qui fait des trucs", id: 1 },
        { name: "truc2", category: "Chambre", quantity: 1, description: "Un autre super truc qui fait aussi des trucs", id: 2 }
    ];

    // Set URL
    function removeSpaces(str: string) {
        return str.replaceAll(" ", "_")
    }

    // UI
    function tableRow(name: string, category: string, quantity: string | number, description: string, row: string) {
        return <div className={row}>
            {selectedCateg === "All"
                ? <p className="item-table-column item-table-category">{category}</p>
                : <></>
            }
            <p className="item-table-column item-table-name">{name}</p>
            <p className="item-table-column item-table-quantity">{quantity}</p>
            <p className="item-table-column item-table-description">{description}</p>
            <Image src={bin} alt="bin" className="item-table-bin" width="20" onClick={() => deleteItem(name, category, parseInt(quantity.toString()), description)} />
        </div>
    }

    return (
        <div>
            <div className="items-buttons">
                <h1>Ce sont les objects de la maison !</h1>
            </div>

            <div id="items-categories-list">
                {categories.map((categ, index) => {
                    return <Link
                        href={"/house/items?category=" + removeSpaces(categ)}
                        id={removeSpaces(categ) === selectedCateg ? "selected-category" : ""}
                        className={"items-category"}
                        key={index}
                    >
                        {categ}
                    </Link>
                })}
            </div>

            <div id="items-table-area">
                <div id="items-table">

                    {tableRow("Nom", "Catégorie", "Quantité", "Description", "items-table-header")}
                    <div className="items-table-row" id="items-table-add">
                        <div>
                            {selectedCateg === "All"
                                ? <textarea className="item-table-column item-table-category"></textarea>
                                : <></>
                            }
                            <textarea className="item-table-column item-table-name"></textarea>
                            <textarea className="item-table-column item-table-quantity"></textarea>
                            <textarea className="item-table-column item-table-description"></textarea>
                        </div>
                        <button id="items-add">Ajouter</button>
                    </div>
                    {items.map(({ name, category, quantity, description }) => tableRow(name, category, quantity, description, "items-table-row"))}
                </div>
            </div>
        </div>
    )
}
