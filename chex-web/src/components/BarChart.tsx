import React, {useMemo} from "react";

interface BarChartProps<T> {
    /** The values to visualize. */
    values: Array<T>;
    /** Returns the y-value, the height, for a value */
    yValueFn: (value: T) => number;
    /** Returns the label on the x-axis for a value or its index in the value array. */
    xLabelFn: (value: T, idx: number) => string;
    /** Additional styles */
    style?: React.CSSProperties;
}

function BarChart<T>(props: BarChartProps<T>) {
    const max = useMemo(() => {
        return props.values.reduce((prev, curr) => {
            const c = props.yValueFn(curr);
            return c < prev ? prev : c;
        }, 0);
    }, [props.values, props.yValueFn]);
    const ysegments = useMemo(() => new Array(4).fill(0), []);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                alignSelf: "stretch",
                flexWrap: "wrap",
                ...props.style,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 1,
                    alignItems: "stretch",
                }}
            >
                <div
                    style={{
                        flexGrow: 0,
                        flexShrink: 0,
                        maxWidth: "20px",
                        minWidth: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "stretch",
                    }}
                >
                    {ysegments.map((_v, idx) => {
                        return (
                            <div
                                key={"ysegment-" + idx}
                                style={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                }}
                            >
        <span style={{flexGrow: 1, fontSize: "small"}}>
        {Math.round(max - idx * max / ysegments.length)}
        </span>
                                <div
                                    style={{
                                        minWidth: "5px",
                                        flexShrink: 0,
                                        flexGrow: 0,
                                        borderColor: "black",
                                        borderStyle: "solid",
                                        borderWidth: "1px 0 0 0",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <div
                    style={{
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: "0 0 thin thin",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "flex-end",
                    }}
                >
                    {props.values.map((v, idx) => {
                        return (
                            <div
                                key={"bar-" + idx}
                                style={{
                                    paddingLeft: "2%",
                                    paddingRight: "2%",
                                    height: (props.yValueFn(v) / max) * 100 + "%",
                                    width: 100.0 / props.values.length + "%",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#77aaff",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 0,
                    flexShrink: 0,
                    alignItems: "stretch",
                }}
            >
                <div
                    style={{
                        backgroundColor: "red",
                        flexGrow: 0,
                        flexShrink: 0,
                        maxWidth: "20px",
                        minWidth: "20px",
                        alignSelf: "flex-end",
                    }}
                />
                <div
                    style={{
                        flexGrow: 1,
                        minHeight: "20px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                    }}
                >
                    {props.values.map((v, idx) => {
                        return (
                            <div
                                key={"xlabel-" + idx}
                                style={{
                                    fontSize: "small",
                                    flexGrow: 1,
                                    paddingLeft: "2%",
                                    paddingRight: "2%",
                                }}
                            >
                                {props.xLabelFn(v, idx)}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BarChart;