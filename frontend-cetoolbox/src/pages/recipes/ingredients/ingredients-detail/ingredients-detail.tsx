import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './ingredients-detail.css';
import { ingredient, tag } from '../../../../components/types';
import { button, checkbox } from '../../../../components/components';

function IngredientsDetail() {
    let navigate = useNavigate();
    let name = useParams()?.itemName ?? "";

    const [ingredient, setIngredient] = React.useState<ingredient>({
        _id: '',
        name: name,
        tags: [{ _id: "1", name: 'Oui', color: '789456' }],
        kcalPerGram: 0,
        toGramFactor: 0,
        restrictions: {
            isVegan: false,
            isVeggie: false,
            isGlutenFree: false,
            isCheeseFree: true,
            isFishFree: true
        }
    });
    const [tags, setTags] = React.useState<tag[]>([{ _id: '1', name: 'Oui', color: '789456' }, { _id: '2', name: 'Bleu', color: 'fffa75' }, { _id: '3', name: 'Eau', color: '22ffff' }]);
    const [showAdd, setShowAdd] = React.useState<boolean>(false);
    const [newTag, setNewTag] = React.useState<tag>({ _id: '', name: '', color: 'c0c0c0' });
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
                tagIsSelected = ingredient.tags[j]._id === tags[i]._id;
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
                        newTagIsSelected = ingredient.tags[j]._id === tags[i]._id;
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
        // Add the tag to the database
        // Add the tag to the ingredient
        // Update the tags list
        let newTagWithÏd = newTag;
        newTagWithÏd._id = ""; // Result of the database call
        setTags([...tags, newTagWithÏd]);
        setNewTag({ _id: "", name: "", color: "c0c0c0" });
        setIngredient({ ...ingredient, tags: [...ingredient.tags, newTagWithÏd] });
    }

    function editIngredient(): void {
        // Edit the element from the ingredient list
        // Edit the element from the meal list
    }

    function deleteIngredient(): void {
        // Delete the element from the ingredient list
        // Delete the element from the meal list
    }

    return <div id="ingredient-detail" className='page'>
        <div id="ingredient-detail-back">{button("Retourner à la liste des ingrédients", () => navigate('/recipes/ingredients'))}</div>
        <div id="ingredient-detail-delete">{button("Supprimer l'ingrédient", () => deleteIngredient(), true)}</div>
        <h2 id="ingredient-detail-title">{ingredient.name}</h2>
        <div id="ingredient-detail-restrictions-area">
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/vegan.png' />
                <label className="ingredient-detail-restrictions-text">Vegan</label>
                {checkbox(ingredient.restrictions.isVegan, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, isVegan: !ingredient.restrictions.isVegan } }))}
            </div>
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/veggie.png' />
                <label className="ingredient-detail-restrictions-text">Veggie</label>
                {checkbox(ingredient.restrictions.isVeggie, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, isVeggie: !ingredient.restrictions.isVeggie } }))}
            </div>
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/glutenFree.png' />
                <label className="ingredient-detail-restrictions-text">Gluten-free</label>
                {checkbox(ingredient.restrictions.isGlutenFree, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, isGlutenFree: !ingredient.restrictions.isGlutenFree } }))}
            </div>
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/cheeseFree.png' />
                <label className="ingredient-detail-restrictions-text">Cheese-free</label>
                {checkbox(ingredient.restrictions.isCheeseFree, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, isCheeseFree: !ingredient.restrictions.isCheeseFree } }))}
            </div>
            <div className='ingredient-detail-restrictions'>
                <img alt="vegan" className="ingredient-detail-restrictions-icon" src='/food-icons/fishFree.png' />
                <label className="ingredient-detail-restrictions-text">Fish-free</label>
                {checkbox(ingredient.restrictions.isFishFree, () => setIngredient({ ...ingredient, restrictions: { ...ingredient.restrictions, isFishFree: !ingredient.restrictions.isFishFree } }))}
            </div>
        </div>

        <div id="ingredient-detail-elt-area">
            <div id="ingredient-detail-tags-area" className='ingredient-detail-elt-col'>
                <p id='ingredient-detail-elt-title'>Tags</p>
                <div id="ingredient-detail-tags-list">
                    {displayTags()}
                </div>
                {showAdd && <div id='ingredient-detail-tags-new'>
                    <input type="text" className='ingredient-detail-input' id='ingredient-detail-tags-new-input' placeholder='Tag' value={newTag.name} onChange={(e) => setNewTag({ _id: "", name: e.target.value, color: newTag.color })} />
                    <input type="color" id='ingredient-detail-tags-new-color' defaultValue={newTag.color} value={newTag.color} onChange={e => { setNewTag({ _id: "", name: newTag.name, color: e.target.value.replace("#", "") }) }} />
                    <div className='ingredient-detail-tags-label' style={{ backgroundColor: "#" + newTag.color }}>
                        {newTag.name === '' ? 'Tag' : newTag.name}
                    </div>
                    {newTag.name !== '' && button('Ajouter', () => { addTag() })}
                    {button("Annuler l'ajout", () => { setShowAdd(!showAdd) })}
                </div>}
                {!showAdd && button('Ajouter un tag', () => { setShowAdd(!showAdd) })}
            </div>
            <div id='ingredient-detail-numbers' className='ingredient-detail-elt-col'>
                <div>
                    <p id='ingredient-detail-elt-title'>Kcal par gramme</p>
                    <input type="number" min={0} className='ingredient-detail-input' id='ingredient-detail-elt-input' value={ingredient.kcalPerGram} onChange={e => setIngredient({ ...ingredient, kcalPerGram: parseInt(e.target.value) })} />
                </div>
                <div>
                    <p id='ingredient-detail-elt-title'>Facteur de conversion</p>
                    <p id='ingredient-detail-elt-subtitle'>(1 si on compte en gramme, x si on compte en autre chose <br />(ex : masse d'un oeuf en g))</p>
                    <input type="number" min={0} className='ingredient-detail-input' id='ingredient-detail-elt-input' value={ingredient.toGramFactor} onChange={e => setIngredient({ ...ingredient, toGramFactor: parseInt(e.target.value) })} />
                </div>
            </div>
        </div>

        {button('Sauvegarder les modifications', () => { editIngredient() })}
    </div >
}

export default IngredientsDetail;