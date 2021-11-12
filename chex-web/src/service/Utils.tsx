import DescriptionData from "../types/DescriptionData";
import React from "react";

function getTrigger(index: number, item: string): string {
    // 1. e2e4  1. b7b6   2. c2c4  2. d7d6
    return (Math.ceil((index + 1) / 2)).toString() + ": " + item;
}

function formatDescription(description: string, descData: DescriptionData) {
    if (descData.opening && description.includes(descData.opening) && descData.link) {
        // replace any occurrences of 'opening' with link to opening
        const link = <a href={descData.link}>{descData.opening}</a>;
        description = description.replaceAll(descData.opening, "$")
        const index = description.indexOf("$");
        return <p>{description.substr(0, index)}{link}{description.substr(index + 1)}</p>
    }
    return <p>{description}</p>
}

const Utils = {
    getTrigger,
    formatDescription
}

export default Utils;