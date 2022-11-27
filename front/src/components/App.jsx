import React, { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const MOVIE_API_URL = process.env.REACT_APP_API_URL || "https://faas.patito.club/function/movies";

const initialState = {
  loading: false,
  movies: [],
  errorMessage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload,
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error,
      };
    default:
      return state;
  }
};

const buildRequestBody = function (searchValue) {  // TODO the filter is not working well
  let search = { s: searchValue, type: "movie", page: 1 };
  if (searchValue.includes("title:") || searchValue.includes("type") || searchValue.includes("limit:")) {
    let titleIndex = searchValue.indexOf("title:");
    let typeIndex = searchValue.indexOf("type:");
    let pageIndex = searchValue.indexOf("limit:");
    if (titleIndex !== -1 || typeIndex !== -1 || pageIndex !== -1) {
      if (pageIndex !== -1) {
        search["page"] = Number(searchValue.substring(pageIndex + 6).trim());
      }
      if (typeIndex !== -1) {
        if (pageIndex !== -1) {
          search["type"] = searchValue.substring(typeIndex + 5, pageIndex).trim();
        } else {
          search["type"] = searchValue.substr(typeIndex).trim();
          if (titleIndex !== -1) search["s"] = searchValue.substr(titleIndex + 6, typeIndex - 6).trim();
        }
      }
      if (titleIndex !== -1) search["s"] = searchValue.substr(titleIndex + 6).trim();
    }
  }
  return search;
};

const App = function () {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log("Side effect");
  });

  const search = (searchValue) => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST",
    });

    let body = buildRequestBody(searchValue);
    
    fetch(MOVIE_API_URL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "True") {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: data.Search,
          });
        } else {
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            payload: data.Error,
          });
        }
      });
  };

  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header title="Avocado" />
      <Search search={search} />
      <p className="App-intro">Use keywords to narrow the search results.</p>
      <code>
        title:{`<movie title>`} type:{`<movie|series|episode>`} {' '}limit:12
      </code>
      <p>Example, search Pretty Woman movie limit result to 5 matches only.</p>
      <code>title:pretty woman type:movie limit:5</code>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => <Movie key={`${index}`} movie={movie} />)
        )}
      </div>
    </div>
  );
};

export default App;
