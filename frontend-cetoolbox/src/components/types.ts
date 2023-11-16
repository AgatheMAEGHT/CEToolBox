export type blockText = {
    id: number,
    content: string,
    delete: (params: number) => void
}

export type blockType = {
    content: JSX.Element,
    type: string,
    id: number
}

export type docType = blockType[]