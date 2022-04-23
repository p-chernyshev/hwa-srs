function shuffle<T>(array: T[]): T[] {
    const copyArray = [...array];

    for (let i = copyArray.length -1; i > 0; i--) {
        const newIndex = Math.floor(Math.random() * i);
        const currentElement = copyArray[i];
        copyArray[i] = copyArray[newIndex];
        copyArray[newIndex] = currentElement;
    }

    return copyArray;
}

export {
    shuffle,
};
