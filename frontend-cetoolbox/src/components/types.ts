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
