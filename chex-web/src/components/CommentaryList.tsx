import React from "react";
import Collapsible from "react-collapsible";

interface CommentaryListProps {
    commentaryList: string[],
    moveStack: string[]
}

function CommentaryList(props: CommentaryListProps) {
    return (
        <div>
            {props.commentaryList.map((item: string, index: number) =>
                <Collapsible key={index} trigger={item}>
                    <p>{props.moveStack[index]}</p>
                </Collapsible>
            )}
        </div>
    )
}

export default CommentaryList;