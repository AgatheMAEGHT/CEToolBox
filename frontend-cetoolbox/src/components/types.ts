/* ============== *
*    COMPONENTS
** ============== */
export type buttonType = {
    text: string,
    onClick: () => void,
    del?: boolean,
    className?: string,
    width?: string,
    padding?: string,
    rounded?: boolean,
    disabled?: boolean,
};

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
    _id: string,
    name: string,
    color: string
}

type restrictions = {
    isVegan: boolean,
    isVeggie: boolean,
    isGlutenFree: boolean,
    isCheeseFree: boolean,
    isFishFree: boolean
}

export type ingredientDB = {
    _id: string,
    name: string,
    tags: string[],
    kcalPerGram: number,
    toGramFactor: number,
    restrictions: restrictions,
}

export type ingredient = {
    _id: string,
    name: string,
    tags: tag[],
    kcalPerGram: number,
    toGramFactor: number,
    restrictions: restrictions,
}

export type recipe = {
    _id: string,
    name: string,
    image: string,
    ingredients: ingredientDB[],
    quantities: number[], // same length as ingredients
    numberOfPortions: number, // default number of portions (then transforms the quantities)
    preparationTime: number, // en minutes
    cookingTime: number, // en minutes
    categories: tag[], // entrée, plat, dessert, apéro, petit-déjeuner, goûter, boisson, sauce, accompagnement
    origin: tag, // pays d'origine
    status: tag, // approuvé, à tester, refusé...
    type: tag, // salé, sucré, sucré-salé
    steps: string[], // markdown
    // kcalPerPortion: number, // calculated from ingredients and quantities
    // restrictions: restrictions, // calculated from ingredients
    // tags: tag[], // calculated from ingredients,
}