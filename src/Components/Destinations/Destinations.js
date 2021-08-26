import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const Destinations = (props) => {
  const arr = props.result;
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    console.log(arr);
    let p = [];
    arr.forEach((item, index) => {
      let place = fetch(
        `https://api.opentripmap.com/0.1/en/places/xid/${item.xid}?apikey=${process.env.REACT_APP_OPENTRIPMAPKEY}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .catch((e) => console.log("hhh"));
      place.then((res) => {
        p[index] = res;
      });
    });
    console.log(".....", p);
    const timeout = setTimeout(() => {
      setPlaces([...p]);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [arr]);

  const arrowStyles = {
    position: "absolute",
    zIndex: 2,
    top: "calc(25% - 5px)",
    fontWeight: "bold",
    fontSize: "15px",
    width: 30,
    height: 30,
    cursor: "pointer",
    backgroundColor: 'grey',
    border: 'none',
    '&:hover': {
        backgroundColor: "black",
     },
  };

  return (
    <div style={{ right: "10px", color: "#c9c8c8" }} className="Box CarouselBox">
      {places.length > 0 && (
        <Carousel
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ ...arrowStyles, left: 15 }}
              >
                {"<"}
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ ...arrowStyles, right: 15 }}
              >
                {">"}
              </button>
            )
          }
          showThumbs={false}
        >
          {places.map((place, index) => (
            <div key={index}>
              {place.preview && place.preview.source && (
                <img
                  src={place.preview.source}
                  alt=""
                  
                  className="Thumbnails"
                />
              )}
              <h3 >{place.name}</h3>
              {place.wikipedia_extracts && place.wikipedia_extracts.text && (
                <p>{place.wikipedia_extracts.text}</p>
              )}
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default Destinations;
