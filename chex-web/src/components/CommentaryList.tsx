import React from "react";
import Collapsible from "react-collapsible";

interface CommentaryListProps {
    commentaryList: string[],
    moveStack: string[]
}

function CommentaryList(props: CommentaryListProps) {

    function getTrigger(index: number, item : string): string {
        return (Math.ceil((index + 1) / 2)).toString() + ": " + item;
    }

    return (
        <div>
            {props.commentaryList.map((item: string, index: number) =>
                <Collapsible key={index} trigger={getTrigger(index, props.moveStack[index])}>
                    <p>{item}</p>
                </Collapsible>
            )}
        </div>
    )
}

export default CommentaryList;