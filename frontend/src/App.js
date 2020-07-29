import React, { useState } from 'react';
import './App.css';
import axios from 'axios'
import { Button, Form, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import ResultTable from './ResultTable'

import whitepowerJson from './data/whitepower.json'

function App() {
    const [tweetInput, setTweetInput] = useState('');
    const [result, setResult] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [tableResult, setTableResult] = useState({});

    const onTweetSubmit = (e) => {    
        e.preventDefault()
        classifyText(tweetInput).then(result => setResult(result));
    };

    const classifyText = async (text) => {
        try {
            const res = await axios.get('http://localhost:8000/predict', {
                params: {
                    input: text
                }
            })
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const handleDropdown = (hashtag) => {
        console.log(hashtag);
        
        const tweets = whitepowerJson.statuses.map(item => item.full_text)
        let result = {};
        for (let tweet of tweets) {
            classifyText(tweet).then(res => result[tweet] = res);
        }
        setTableResult(result);
    }

    return (
        <div className="App">
            <h1>Offensive Speech Identifer</h1>
            <Form onSubmit={onTweetSubmit}>
                <FormGroup>
                    <Label for="exampleText">Enter any text here:</Label>
                    <Input 
                        type="textarea" 
                        name="text" 
                        id="exampleText"
                        onChange={e => setTweetInput(e.target.value)}
                    />
                </FormGroup>
                <Button type="submit">Submit</Button>
            </Form>
            <br></br>
            <h2>Result: {result}</h2>

            <h1>Twitter Hashtag Trending Analysis</h1>

            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret>
                    Select search files
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>hashtags</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                        onClick = {() => handleDropdown("whitepower")}
                    >
                        #whitepower
                    </DropdownItem>
                    <DropdownItem
                        onClick = {() => handleDropdown("blm")}
                    >
                        #blm
                    </DropdownItem>
                    <DropdownItem
                        onClick = {() => handleDropdown("seattleprotests")}
                    >
                        #seattleprotests
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <br></br>
            <ResultTable data={tableResult}/>
        </div>
    )
}

export default App;
