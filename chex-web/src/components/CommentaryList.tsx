import React from "react";
import Collapsible from "react-collapsible";

interface CommentaryListProps {
    commentaryList: string[][],
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

    return (
        <div>
            {props.commentaryList.map((descriptions: string[], index: number) =>
                <Collapsible
                    key={index}
                    easing={"ease-in"}
                    trigger={getTrigger(index, props.moveStack[index])}
                    onOpening={() => props.onOpening(index)}
                    onOpen={() => props.onOpen(index)}
                    onClosing={() => props.onClosing()}>
                    {descriptions.map((item: string, index: number) =>
                        <p>{item}</p>
                    )}
                </Collapsible>
            )}
        </div>
    )
}

export default CommentaryList;