export type blockText = {
    content: string,
};

export type blockKatex = {
    content: string,
};


export type blockCode = {
    langage: string,
    content: string,
};


export type blockImage = {
    content: string,
    size: string,
};

export type blockType = {
    id: number,
    type: string,
    content: JSX.Element,
};

export type docType = blockType[];
