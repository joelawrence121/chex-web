import React from "react";
import Collapsible from "react-collapsible";
import DescriptionData from "../types/DescriptionData";

interface CommentaryListProps {
    descDataStack: DescriptionData[]
    moveStack: string[],
    onOpening: (index: number) => void,
    onOpen: (index: number) => void,
    onClosing: () => void
}

function CommentaryList(props: CommentaryListProps) {

    function getTrigger(index: number, item: string): string {
        // 1. e2e4  1. b7b6   2. c2c4  2. d7d6
        return (Math.ceil((index + 1) / 2)).toString() + ": " + item;
    }

    function formatItem(description: string, descData: DescriptionData, index: number) {
        // replace any occurrences of 'opening' with link to opening
        if (descData.opening) {
            if (description.includes(descData.opening)) {
                if (descData.link) {
                    const link = <a href={descData.link}>{descData.opening}</a>;
                    description = description.replaceAll(descData.opening, "$")
                    const index = description.indexOf("$");
                    return <p>{description.substr(0, index)}{link}{description.substr(index + 1)}</p>
                }
            }
        }
        return <p>{description}</p>
    }

    return (
        <div>
            {props.descDataStack.map((descData: DescriptionData, index: number) =>
                <Collapsible
                    key={index}
                    easing={"ease-in"}
                    trigger={getTrigger(index, props.moveStack[index])}
                    onOpening={() => props.onOpening(index)}
                    onOpen={() => props.onOpen(index)}
                    onClosing={() => props.onClosing()}>
                    {descData.descriptions.map((description: string, index: number) =>
                        formatItem(description, descData, index)
                    )}
                </Collapsible>
            )}
        </div>
    )
}

export default CommentaryList;