import React from 'react';
import { useParams } from 'react-router-dom';

import './ingredients-detail.css';
import { ingredient, tag } from '../../../../components/types';
import { button, checkbox } from '../../../../components/components';

function IngredientsDetail() {

    let name = useParams()?.itemName ?? "";

    const [ingredient, setIngredient] = React.useState<ingredient>({
        _id: '',
        name: name,
        tags: [{ name: 'Oui', color: '789456' }],
        kcalPerGram: 0,
        toGramFactor: 0,
        restrictions: {
            vegan: false,
            vegetarian: false,
            glutenFree: false,
            cheeseFree: true,
            fishFree: true
        }
    });
    const [tags, setTags] = React.useState<tag[]>([{ name: 'Oui', color: '789456' }, { name: 'Bleu', color: 'fffa75' }, { name: 'Eau', color: '22ffff' }]);
    const [showAdd, setShowAdd] = React.useState<boolean>(false);
    const [newTag, setNewTag] = React.useState<tag>({ name: '', color: 'c0c0c0' });
    console.log(newTag);

    React.useEffect(() => {
        // Get the ingredient from the database
        // Get the tags from the database
    },);

    function displayTags(): JSX.Element | JSX.Element[] {
        let cellTags: JSX.Element[] = [];
        for (let i = 0; i < tags.length; i++) {
            let tagIsSelected: boolean = false;
            let j = 0;
            while (!tagIsSelected && j < ingredient.tags.length) {
                tagIsSelected = ingredient.tags[j].name === tags[i].name;
                j++;
            }

            cellTags.push(<div className='ingredient-detail-tags' key={i}>
                <div className='ingredient-detail-tags-label' style={{ backgroundColor: "#" + tags[i].color }}>
                    {tags[i].name}
                </div>
                {checkbox(tagIsSelected, () => {
                    let newTags: tag[] = ingredient.tags;
                    let newTagIsSelected: boolean = false;
                    let j = 0;
                    while (!newTagIsSelected && j < ingredient.tags.length) {
                        newTagIsSelected = ingredient.tags[j].name === tags[i].name;
                        j++;
                    }
                    if (newTagIsSelected) {
                        newTags.splice(newTags.indexOf(tags[i]), 1);
                    } else {
                        newTags.push(tags[i]);
                    }
                    setIngredient({ ...ingredient, tags: newTags })
                })}
            </div>);
        }

        return cellTags;
    }

    function addTag(): void {
        // Add the tag to the ingredient
        // Add the tag to the database
    }

    function handleChange(value: string | null) {
        let newValue: ingredient = ingredient;

        // Change the height of the other columns to fit content

        // Change the height of the other columns

        setIngredient(newValue);
    }

    function editIngredient(line: string): void {
        // Edit the element from the ingredient list
        // Edit the element from the meal list
    }

    function deleteIngredient(line: string): void {
        // Delete the element from the ingredient list
        // Delete the element from the meal list
    }

    return <div id="ingredient-detail" className='page'>
        <div id="ingredient-detail-back-border"><div id="ingredient-detail-back">Retourner à la liste des ingrédients</div></div>
        <h2 id="ingredient-detail-title">{ingredient.name}</h2>
        <div id="ingredient-detail-restrictions-area">
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/vegan.png' />
                <label className="ingredient-detail-restrictions-text">Vegan</label>
                {checkbox(ingredient.restrictions.vegan, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, vegan: !ingredient.restrictions.vegan } }))}
            </div>
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/veggie.png' />
                <label className="ingredient-detail-restrictions-text">Veggie</label>
                {checkbox(ingredient.restrictions.vegetarian, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, vegetarian: !ingredient.restrictions.vegetarian } }))}
            </div>
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/glutenFree.png' />
                <label className="ingredient-detail-restrictions-text">Gluten-free</label>
                {checkbox(ingredient.restrictions.glutenFree, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, glutenFree: !ingredient.restrictions.glutenFree } }))}
            </div>
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/cheeseFree.png' />
                <label className="ingredient-detail-restrictions-text">Cheese-free</label>
                {checkbox(ingredient.restrictions.cheeseFree, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, cheeseFree: !ingredient.restrictions.cheeseFree } }))}
            </div>
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/fishFree.png' />
                <label className="ingredient-detail-restrictions-text">Fish-free</label>
                {checkbox(ingredient.restrictions.fishFree, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, fishFree: !ingredient.restrictions.fishFree } }))}
            </div>
        </div>

        <div>
            <div id="ingredient-detail-tags-area">
                <p id='ingredient-detail-tags-title'>Tags</p>
                <div id="ingredient-detail-tags-list">
                    {displayTags()}
                </div>
                {showAdd && <div id='ingredient-detail-tags-new'>
                    <input type="text" id='ingredient-detail-tags-new-input' placeholder='Tag' value={newTag.name} onChange={(e) => setNewTag({ name: e.target.value, color: newTag.color })} />
                    <input type="color" id='ingredient-detail-tags-new-color' defaultValue={newTag.color} value={newTag.color} onChange={e => { setNewTag({ name: newTag.name, color: e.target.value.replace("#", "") }) }} />
                    <div className='ingredient-detail-tags-label' style={{ backgroundColor: "#" + newTag.color }}>
                        {newTag.name}
                    </div>
                    {button('Ajouter', () => { addTag() })}
                </div>}
                {button('Ajouter un tag', () => { setShowAdd(!showAdd) })}
            </div>

        </div>

    </div >
}

export default IngredientsDetail;