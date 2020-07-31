import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import ResultTable from "./ResultTable";
import ResultChart from "./ResultChart";

import whitepowerJson from "./data/whitepower.json";
import blmJson from "./data/blm.json";
import seattleprotestsJson from "./data/seattleprotests.json";

function App() {
  const INITIAL_STATE = {
    hi: "Not offensive speech",
    "this frontend is shit": "Offensive speech",
  };

  const [tweetInput, setTweetInput] = useState("");
  const [result, setResult] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tableResult, setTableResult] = useState(INITIAL_STATE);
  const [dropdownOption, setDropdownOption] = useState("Select hashtag");
  const [isLoading, setIsLoading] = useState(false);

  const onTweetSubmit = (e) => {
    e.preventDefault();
    classifyText(tweetInput).then((result) => setResult(result));
  };

  const classifyText = async (text) => {
    try {
      const res = await axios.get("http://localhost:8000/predict", {
        params: {
          input: text,
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleDropdown = async (hashtag) => {
    setDropdownOption("#" + hashtag);
    setIsLoading(true);
    let tweets;
    switch (hashtag) {
      case "whitepower":
        tweets = whitepowerJson.statuses.map((item) => item.full_text);
        break;
      case "blm":
        tweets = blmJson.statuses.map((item) => item.full_text);
        break;
      case "seattleprotests":
        tweets = seattleprotestsJson.statuses.map((item) => item.full_text);
        break;
      default:
        break;
    }

    let result = {};
    for (let tweet of tweets) {
      const res = await classifyText(tweet);
      result[tweet] = res;
    }
    setTableResult(result);
    setIsLoading(false);
  };

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ margin: "50px 10px 50px 10px" }}>
        <h1>Offensive Speech Identifer</h1>
        <Form onSubmit={onTweetSubmit}>
          <FormGroup>
            <Label for="exampleText">Enter any text here:</Label>
            <Input
              type="textarea"
              name="text"
              id="exampleText"
              onChange={(e) => setTweetInput(e.target.value)}
            />
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>
        <br></br>
        <h2>Result: {result}</h2>
      </div>

      <div style={{ margin: "50px 0px 50px 10px" }}>
        <h1>Twitter Hashtag Trending Analysis</h1>

        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>{dropdownOption}</DropdownToggle>

          <DropdownMenu>
            <DropdownItem header>hashtags</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => handleDropdown("whitepower")}>
              #whitepower
            </DropdownItem>
            <DropdownItem onClick={() => handleDropdown("blm")}>
              #blm
            </DropdownItem>
            <DropdownItem onClick={() => handleDropdown("seattleprotests")}>
              #seattleprotests
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <br></br>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ResultChart data={tableResult} />
            <ResultTable data={tableResult} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
