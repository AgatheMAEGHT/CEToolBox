/* ========== *
*    BLOCKS
** ========== */

export type blockText = {
    content: string | undefined,
};

export type blockKatex = {
    content: string | undefined,
};

export type blockCode = {
    langage: string | undefined,
    content: string | undefined,
};

export type blockImage = {
    content: string | undefined,
    size: string | undefined,
    align: string | undefined,
};

export type blockTable = {
    content: string[][] | undefined,
};

export type blockType = {
    id: number,
    type: string,
    content: JSX.Element,
};

export type docType = blockType[];

/* ======== *
*    FOOD
** ======== */
export type tag = {
    name: string,
    color: string
}

export type ingredientNew = {
    name: string,
    tags: tag[],
    kcalPerGram: number,
    toGramFactor: number,
    restrictions: {
        vegan: boolean,
        vegetarian: boolean,
        glutenFree: boolean,
        cheeseFree: boolean,
        fishFree: boolean
    },
}

export type ingredient = {
    _id: string,
    name: string,
    tags: tag[],
    kcalPerGram: number,
    toGramFactor: number,
    restrictions: {
        vegan: boolean,
        vegetarian: boolean,
        glutenFree: boolean,
        cheeseFree: boolean,
        fishFree: boolean
    },
}

export type recipe = {
    name: string,
    ingredients: ingredientNew[],
    quantity: number[],
    kcalTotal: number, // calculate from ingredients
    image: string,
    categories: string[], // entrée, plat, dessert, apéro, petit-déjeuner, goûter, brunch, boisson
    origin: string, // pays d'origine
    status: string, // approuvé, à tester, refusé
    type: string, // salé, sucré, sucré-salé
    preparationTime: number, // en minutes
    cookingTime: number, // en minutes
    restrictions: {
        vegan: boolean,
        vegetarian: boolean,
        glutenFree: boolean,
        cheeseFree: boolean,
        fishFree: boolean
    }, // calculate from ingredients
    steps: string[], // markdown
}