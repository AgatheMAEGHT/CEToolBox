export type blockText = {
    content: string,
};

export type blockCode = {
    langage: string,
    content: string,
};

export type blockType = {
    id: number,
<<<<<<< HEAD
    type: string,
    content: JSX.Element,
};

export type docType = blockType[];
=======
    content: string,
    delete: (params: number) => void
}

export type blockType = {
    content: JSX.Element,
    type: string,
    id: number
}

export type docType = blockType[]
>>>>>>> 4b106e39a8bb9f6ccd218ba128ee0688435a7748
