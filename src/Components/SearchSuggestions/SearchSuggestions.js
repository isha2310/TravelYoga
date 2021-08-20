import styled from "styled-components";
import {useState} from 'react'
import ReactAutocomplete from 'react-autocomplete'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import classes from './Search.module.css'

const Search = () => {
  const [errors, setErrors] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('')

  const handleOnSearch = (string, result) => {
    console.log(string, result)
    let query = string
    if (query.length > 3) {
      const results = fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=pk.fe39ab4e910632765f07bcb18606fb98&q=${query}&limit=5`,
        {
          method: "GET",
        }
      ).then((res) => res.json());
      results.then((res) => {
        console.log(res);
        if (res.error === "Unable to geocode") {
          setErrors("Place not found. Try Again!");
          setSuggestions([])
        } else if(res.error ){
          setSuggestions([])
          console.log('hiii')
        } 
        else {
          let sugg = []
          res.map((place, index) => {
            let ele = {}
            ele.id = index
            ele.name = place.display_name
            ele.lat = place.lat
            ele.long = place.lon
            sugg.push(ele)
            return sugg
          })
          setSuggestions(sugg)
          console.log(sugg)
        }
        result = suggestions
      });
    } else {
      setSuggestions([])
      result = []
    }
  }

  const handleOnSelect = (item) => {
    console.log(item)
  }

  return (
      <div style={{width: '60vw', margin: 'auto'}} >
        <ReactSearchAutocomplete items={suggestions} onSearch={handleOnSearch} onSelect={handleOnSelect} autoFocus />
      </div>
    );
};

export default Search;
