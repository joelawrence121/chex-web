import React from "react";

interface CommentaryListProps {
    commentaryList: string[]
}

function CommentaryList(props: CommentaryListProps) {
    return (
        <ul className={"commentary"}>
            {props.commentaryList.map((item: string, index: number) =>
                <li className={"commentary"} key={index}>{item}</li>
            )}
        </ul>
    )
}

export default CommentaryList;