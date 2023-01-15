"use client"

import { useSearchParams } from 'next/navigation';
import Link from "next/link";

import { item } from "./_types";

import "./items.css";

export default function Items() {
    const categories: string[] = ["All", "Chambre", "Salon", "Salle de bain"];

    // Selected category
    let getselectedCateg: string | null = useSearchParams().get("category");
    if (getselectedCateg === null) {
        getselectedCateg = "All";
    }
    const selectedCateg = getselectedCateg;

    // Items list
    const items: item[] = [
        { name: "truc1", category: "Chambre", quantity: 5, description: "Un super truc qui fait des trucs" },
        { name: "truc2", category: "Chambre", quantity: 1, description: "Un autre super truc qui fait aussi des trucs" }
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
        </div>
    }

    return (
        <div>
            <h1>Ce sont les objects de la maison !</h1>
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
                    {items.map(({ name, category, quantity, description }) => tableRow(name, category, quantity, description, "items-table-row"))}
                </div>
            </div>
        </div>
    )
}
