import React from 'react';
import './Infobox.css';
import {Card, CardContent, Typography} from '@material-ui/core';
function Infobox({ title, cases, isRed, active, total, ...props}) {
    return (
        <Card onClick = {props.onClick} className = {`infobox ${active && 'infobox-selected'} ${isRed && 'infobox-red'}`}>
            <CardContent>
            {/* Title i.e Coronavirus cases */}
            <Typography 
                className = "infobox_title"
                color = "textSecondary"
            >
            {title}
            </Typography>

            {/* Number of Cases i.e +120k */}
            <h2 className = {`infobox_cases ${!isRed && 'infobox_cases-green'}`}>{cases}</h2>
            
            {/* Total Cases i.e 1.2M */}
            <Typography 
                className = "infobox_total"
                color = "textSecondary"
            >
            {total} Total
            </Typography>

            </CardContent>
        </Card>
    )
}

export default Infobox
