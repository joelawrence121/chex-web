import React, {useEffect, useState} from 'react';
import '../styles/Home.css';
import {Area, AreaChart, CartesianGrid, Tooltip, YAxis} from 'recharts';
import DescriptionData from "../types/DescriptionData";

interface AdvantageGraphProps {
    moveStack: string[]
    dataStack: DescriptionData[]
}

function AdvantageGraph(props: AdvantageGraphProps) {

    const [data, setData] = useState<{ name: string, uv: number }[]>([{name: '', uv: 0}])

    // generate data from props on load
    useEffect(() => {
        const newData: { name: string, uv: number }[] = []
        props.dataStack.forEach(((value, index) => {
            newData.push({name: props.moveStack[index]?.toString(), uv: value.score})
        }))
        setData(newData)
    }, [props.dataStack, props.moveStack])

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
        <AreaChart width={600} height={100} data={data} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
            <YAxis type="number" domain={[-1, 1]} hide={true}/>
            <Tooltip content={<CustomTooltip/>}/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
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

