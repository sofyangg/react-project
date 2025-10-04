import React from 'react'

const Search = ({searchState,searchStateSetter}) => {
  return (
        <div className="search">
            <div>
            <img src='./search.svg'/>
            <input 
            type='text'
            placeholder="Search through thousands of movies"
            value={searchState}
            onChange={(e)=>{searchStateSetter(e.target.value);}}
            />
            </div>
        </div>
  )
}

export default Search