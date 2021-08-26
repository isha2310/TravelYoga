import React, { useEffect, useState } from "react";
import "./App.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Destinations from "./Components/Destinations/Destinations";

function App() {
  const [errors, setErrors] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [places, setPlaces] = useState([]);
  const [intro, setIntro] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (lat !== "" && lon !== "") {
      let min_lat = parseFloat(lat) - 0.5;
      let max_lat = parseFloat(lat) + 0.5;
      let min_lon = parseFloat(lon) - 0.5;
      let max_lon = parseFloat(lon) + 0.5;
      const result = fetch(
        `
      https://api.opentripmap.com/0.1/en/places/bbox?lon_min=${min_lon}&lon_max=${max_lon}&lat_min=${min_lat}&lat_max=${max_lat}&limit=15&apikey=${process.env.REACT_APP_OPENTRIPMAPKEY}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .catch((e) => console.log(e));
      result.then((res) => {
        let results = [];
        res = res.features.filter((item) => {
          if (
            results.filter(
              (res1) =>
                res1.name.toUpperCase() === item.properties.name.toUpperCase()
            ).length === 0 &&
            item.properties.name.trim() !== ""
          ) {
            results.push(item.properties);
            return item.properties;
          } else return null;
        });
        if (results.length > 8) results = results.slice(0, 7);
        setPlaces([...results]);
      })
      .catch((e) => console.log(e) )
    }
  }, [lat, lon]);

  const handleOnSearch = (string, result) => {
    if (string === value) {
      result = suggestions;
    } else {
      setPlaces([]);
      setValue("");
      setLat("");
      setLon("");
      let query = string;
      if (query.length > 3) {
        const results = fetch(
          `https://api.locationiq.com/v1/autocomplete.php?key=${process.env.REACT_APP_LOCATIONKEY}&q=${query}&limit=5`,
          {
            method: "GET",
          }
        )
          .then((res) => res.json())
          .catch((e) => console.log(e));
        results.then((res) => {
          if (res.error === "Unable to geocode") {
            setErrors("Place not found. Try Again!");
            setSuggestions([]);
          } else if (res.error) {
            setSuggestions([]);
          } else {
            let sugg = [];
            res.map((place, index) => {
              let ele = {};
              ele.id = index;
              ele.name = place.display_name;
              ele.lat = place.lat;
              ele.lon = place.lon;
              sugg.push(ele);
              return sugg;
            });
            setSuggestions(sugg);
          }
          result = suggestions;
        });
      } else {
        setSuggestions([]);
        result = [];
      }
    }
  };

  useEffect(() => {
    if (value !== "") {
      let url = `https://www.googleapis.com/customsearch/v1/siterestrict?key=${process.env.REACT_APP_GOOGLEKEY}&cx=${process.env.REACT_APP_SEARCHENGINE}&q=About ${value}`;
      fetch(url, { method: "GET" })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          let info = response.items[0].snippet;
          info = info.replace(/listen/, value);
          setIntro(info);
          setLink(response.items[0].link);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [value]);

  const handleOnSelect = (item) => {
    if (item.name !== value) {
      setValue(item.name);
      setLon(item.lon);
      setLat(item.lat);
    }
  };

  return (
    <div className="App">
      <div>
        <h1 className="Logo">TravelYoga &nbsp;</h1>
      </div>
      <div style={{ margin: "auto" }} className="Search" >
        <ReactSearchAutocomplete
          items={suggestions}
          onSearch={handleOnSearch}
          onSelect={handleOnSelect}
          styling={{border: "0.2rem solid #fff", boxShadow: "0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 0.4rem #bc13fe, 0 0 0.2rem #bc13fe, 0 0 1rem #bc13fe, inset 0 0 1rem #bc13fe" }}
          autoFocus
        />
      </div>
      {value !== "" ? (
        <div className="InfoDiv">
          <div style={{ textAlign: "left" }} className={"IntroBox Box"}>
            <h1
              style={{ color: "#c9c8c8", fontSize: "40px", marginTop: "8px" }}
            >
              {value}
            </h1>
            <p className={"Intro"} >
              {intro} &nbsp;<a href={link} target="_blank" rel="noreferrer" style={{fontSize: '10px'}}>[read more]</a>
            </p>
            <p className={"Intro"}>Some of the popular places here which you might want to visit are here. Have a look at them!</p>
          </div>
          <Destinations result={places} />
        </div>)
        :
        <p className="Slang" >“Traveling – it leaves you speechless, then turns you into a storyteller.” – Ibn Battuta
        </p>
      }
    </div>
  );
}

export default App;
