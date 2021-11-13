import React from "react";
import DescriptionData from "../types/DescriptionData";
import Utils from "../service/Utils";

interface RecentDescriptionProps {
    descDataStack: DescriptionData[]
    moveStack: string[]
}

function RecentDescription(props: RecentDescriptionProps) {

    function getContent() {
        const lastIndex = props.descDataStack.length - 1
        if (props.descDataStack.length > 0) {
            return <p style={{color: props.moveStack.length % 2 == 1 ? "#a1c3f5" : "#131313FF"}}>
                {Utils.getTrigger(lastIndex, props.moveStack[lastIndex])}
                {props.descDataStack[lastIndex].descriptions.map((description: string) =>
                    Utils.formatDescription(description, props.descDataStack[lastIndex])
                )}
            </p>
        }
    }

    function getBackgroundColour() {
        if (props.moveStack.length == 0) {
            return "#131313FF"
        }
        if (props.moveStack.length % 2 == 1) {
            return "#365992"
        }
        return "#a1c3f5"
    }

    return (
        <div style={{background: getBackgroundColour()}}>{getContent()}</div>
    )
}

export default RecentDescription;