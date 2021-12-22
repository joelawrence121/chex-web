import React from "react";
import Collapsible from "react-collapsible";
import DescriptionData from "../types/DescriptionData";
import '../styles/CommentaryBox.css';
import Utils from "../service/Utils";

interface CommentaryListProps {
    descDataStack: DescriptionData[]
    moveStack: string[],
    fenStack: string[],
    onOpening: (index: number) => void,
    onOpen: (index: number) => void,
    onClosing: () => void
}

function CommentaryList(props: CommentaryListProps) {

    return (
        <>
            {props.descDataStack.map((descData: DescriptionData, index: number) =>
                <Collapsible className="opening-collapsible"
                             key={index}
                             easing={"ease-in"}
                             trigger={Utils.getTrigger(index, props.moveStack, props.fenStack)}
                             onOpening={() => props.onOpening(index)}
                             onOpen={() => props.onOpen(index)}
                             onClosing={() => props.onClosing()}>
                    {descData.descriptions.map((description: string) =>
                        Utils.formatDescription(description, descData)
                    )}
                </Collapsible>
            )}
        </>
    )
}

export default CommentaryList;