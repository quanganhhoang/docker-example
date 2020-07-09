import React, { useState } from 'react';
import './App.css';
import axios from 'axios'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

function App() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const onSubmit = (e) => {    
        e.preventDefault()
    
        axios.get('http://localhost:8000/predict', {
            params: {
                input: input
            }
        }).then(res => {
            setResult(res.data)
        })
    };

    return (
        <div className="App">
            <h1>Offensive Speech Identifer</h1>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label for="exampleText">Enter any text here:</Label>
                    <Input 
                        type="textarea" 
                        name="text" 
                        id="exampleText"
                        onChange={e => setInput(e.target.value)}
                    />
                </FormGroup>
                <Button type="submit">Submit</Button>
            </Form>
            <br></br>
            <h2>Result: {result}</h2>
        </div>
    )
}

export default App;
