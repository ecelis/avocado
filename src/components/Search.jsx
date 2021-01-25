import React, { useState } from "react";

const Search = props => {
  const [searchValue, setSearchValue] = useState("");

  const handleSetSearchInputChange = e => {
    setSearchValue(e.target.value);
  };
  const resetInputField = () => {
    setSearchValue("");
  };
  const doSearch = e => {
    e.preventDefault();
    props.search(searchValue);
    resetInputField();
  };

  return (
    <form className="search">
      <input
        value={searchValue}
        onChange={handleSetSearchInputChange}
        type="text"
      />
      <input onClick={doSearch} type="submit" value="Search" />
    </form>
  );
};

export default Search;
