import React, { useState } from 'react';
import ReactWordcloud from "react-wordcloud";
import { Button } from 'reactstrap';

const WordCloud = ( { words } ) => {
    const [toggle, setToggle] = useState(false);

    const toggleWordcloud = (e) => {
        e.preventDefault();
        setToggle(!toggle);
    }

    const options = {
        colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
        enableTooltip: true,
        deterministic: false,
        fontFamily: 'impact',
        fontSizes: [10, 100],
        fontStyle: 'normal',
        fontWeight: 'normal',
        padding: 5,
        rotations: 3,
        rotationAngles: [0, 90],
        scale: 'sqrt',
        spiral: 'archimedean',
        transitionDuration: 1000,
        background: '#f0f0f0'
    };
    
    return (
        <div>
            <Button
                outline
                color="primary"
                className="toggle-btn"
                onClick={e => toggleWordcloud(e)}
            >
                Show word cloud
            </Button>
            
            {
                toggle ? 
                (
                    <div id="word-cloud">
                        <ReactWordcloud words={words} options={options}/>
                    </div>
                ) : ''
            }
        
        </div>
    )
}

export default WordCloud;