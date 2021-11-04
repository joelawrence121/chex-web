import React from "react";
import Collapsible from "react-collapsible";

interface CommentaryListProps {
    commentaryList: string[],
    moveStack: string[],
    onOpening: (index: number) => void,
    onOpen: (index: number) => void,
    onClosing: () => void
}

function CommentaryList(props: CommentaryListProps) {

    function getTrigger(index: number, item: string): string {
        return (Math.ceil((index + 1) / 2)).toString() + ": " + item;
    }

    return (
        <div>
            {props.commentaryList.map((item: string, index: number) =>
                <Collapsible
                    key={index}
                    easing={"ease-in"}
                    trigger={getTrigger(index, props.moveStack[index])}
                    onOpening={() => props.onOpening(index)}
                    onOpen={() => props.onOpen(index)}
                    onClosing={() => props.onClosing()}>
                    <p>{item}</p>
                </Collapsible>
            )}
        </div>
    )
}

export default CommentaryList;