import React, {useEffect, useState} from 'react';
import '../styles/Home.css';
import {Area, AreaChart, CartesianGrid, Tooltip, YAxis} from 'recharts';
import DescriptionData from "../types/DescriptionData";
import PlayData from "../types/PlayData";

interface AdvantageGraphProps {
    moveStack: string[] | undefined
    dataStack: DescriptionData[] | undefined
    playStack: PlayData[] | undefined
    scoreStack: number[] | undefined
    width: number | undefined
}

function AdvantageGraph(props: AdvantageGraphProps) {

    const [data, setData] = useState<{ name: string, uv: number }[]>([{name: '', uv: 0}])

    // generate data from props on load
    useEffect(() => {
        const newData: { name: string, uv: number }[] = []
        // permit data from description or play stacks
        if (props.dataStack) {
            props.dataStack.forEach(((value, index) => {
                // add value if exists, if not default to previous value
                newData.push({
                    name: props.moveStack![index]?.toString(),
                    uv: value.score ? Math.round(value.score * 100) / 100 : newData[newData.length - 1].uv
                })
            }))
        } else if (props.playStack) {
            props.playStack.forEach(((value, index) => {
                newData.push({
                    name: index.toString(),
                    uv: value.score ? Math.round(value.score * 100) / 100 : newData[newData.length - 1].uv
                })
            }))
        } else if (props.scoreStack) {
            props.scoreStack.forEach(((value, index) => {
                newData.push({
                    name: props.moveStack![index]?.toString(),
                    uv: value ? Math.round(value * 100) / 100 : newData[newData.length - 1].uv
                })
            }))
        }
        setData(newData)
    }, [props.dataStack, props.moveStack, props.playStack, props.scoreStack])

    const CustomTooltip = ({active, payload}: any) => {
        if (active && payload) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${payload[0].payload.name} : ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <AreaChart width={props.width} height={100} data={data} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
            <YAxis type="number" domain={[-1, 1]} hide={true}/>
            <Tooltip content={<CustomTooltip/>}/>
            <CartesianGrid stroke="#eee" strokeDasharray="2 5"/>
            <Area
                type='monotone'
                dataKey='uv'
                stroke='#a1c3f5'
                fill='#a1c3f5'
            />
        </AreaChart>
    );
}

export default AdvantageGraph;

