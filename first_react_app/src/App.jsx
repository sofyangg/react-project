import {useEffect, useState } from 'react';
import './App.css';
import Search from './components/search.jsx';
import {BounceLoader}  from "react-spinners";
import {useDebounce} from 'react-use';
import MovieCard from './components/movieCard.jsx';
import {UpdateSearchCount,selectTrendingMovies} from './AppWrite.js';

const BASE_URL='https://api.themoviedb.org/3';

const API_KEY=import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS={
  method :'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
};

export const App = () => {

  const [searchState,searchStateSetter]=useState('');
  const [errorState,setErrorState]=useState(false);
  const [movieList,setMovieList]=useState([]);
  const [loadingState,setLoadingState]=useState(true);
  const [debouncedSearchTerm,setDebouncedSearchTerm]=useState('');
  const [trendingMoviesState,setTrendingMoviesState]=useState([])
  useDebounce(()=>setDebouncedSearchTerm(searchState),500,[searchState]);

  const fetchMovies = async (query='') => {
    try{
      const url=query!=''?`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${BASE_URL}/discover/movie?sort_by=popularity.desc`
      console.log(url);
      
      const response = await fetch(url,API_OPTIONS);
      if (response.status==200){
        console.log('received');
      }
      if (response.status!=200){
        setLoadingState(false);
        setErrorState(true);
        throw new Error(`failed to fetch11 ${response.status}`);
        return ;
      }

      const data= await response.json();
      
      if (data.total_results ===0){
        setLoadingState(false);
        setErrorState(true);
        throw new Error('failed to fetch22');
        return ;
      }
      
      setMovieList( data.results||[]);
      if (query!=''){
        console.log(data.results[0]);
        UpdateSearchCount(query,data.results[0]);
      } 
    }catch(error){
      console.log(`error:${error}`);
    }finally{
      setLoadingState(false);
    }
  }
  
  
  
  useEffect(()=>{rows=selectTrendingMovies(); setTrendingMoviesState(rows||[])},[]);
  
  
  
  useEffect(()=>{fetchMovies(debouncedSearchTerm);},
[debouncedSearchTerm]
);


  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
        <img src='./logo.svg' alt="logo" className="w-30 h-auto"/>
        <img src="./hero-img.png" alt="hero image"/>
        <h1 className="base">find <span className="text-gradient">movies</span> without the hassle</h1>
        </header>
        <Search searchState={searchState} searchStateSetter={searchStateSetter}/>
      </div>
      <section className='all-movies'>
        <h2 className='mt-4' >All Movies:</h2>
        {errorState?
        <p>error sorry</p>
        :loadingState?
        <BounceLoader color={"#0999f3"}/>
        :(
          <section className='all-movies'>
          <ul>
            {movieList.map((movie)=>
            (<MovieCard key={movie.id} 
              movie={movie}/>))
            }
          </ul>
          </section>
          )
        
        }
      </section>
    </main>
  );
}


export default App;
