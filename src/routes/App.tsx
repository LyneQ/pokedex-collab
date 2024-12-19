import { useState, useEffect } from "react"
import ListCartPokemon from "../components/ListCartPokemon"
import '../assets/scss/components/PokemonContainer.scss'
import IconSearch from '/icons8-search-50.png'
import dataNames from '../../public/pokemons.json'
//https://pokeapi.co/api/v2/pokemon?limit=20&offset=0

function App() {
  const [pokemons, setPokemons] = useState<object[]>([{name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/'}])
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [catchData, setCatchData] = useState<string[]>([])

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
    .then(response => response.json())
    .then(data => {
      setPokemons(data.results)
      setNextUrl(data.next)
      setCatchData(dataNames)
    })
  }, [])

  const handleShowMore = () => {
    if (nextUrl) {
      fetch(nextUrl)
      .then(response => response.json())
      .then(data => {
        setPokemons(prevPokemons => [...prevPokemons, ...data.results])  
        setNextUrl(data.next)
      })
    }
  }

  const handleAutocomplete = () => {
    const searchPokemon = document.querySelector('.searchPokemon') as HTMLInputElement
    const suggestionContainer = document.querySelector('.suggestions') as HTMLDivElement
    const value = searchPokemon.value
    // const regex = new RegExp(`^${value}`, 'gi')
    if (value.length > 0) {
      const suggestions = catchData.filter((name: string) => name.match(value))
      suggestionContainer.innerHTML = ''
      suggestions.forEach((suggestion) => {
        const p = document.createElement('li')
        p.className = 'suggestion'
        p.textContent = suggestion
        suggestionContainer.appendChild(p)
      })
    }
  }

  const maskSuggestion = () => {
    const searchPokemon = document.querySelector('.searchPokemon') as HTMLInputElement
    const suggestionContainer = document.querySelector('.suggestions') as HTMLDivElement
    suggestionContainer.innerHTML = ''
    searchPokemon.value = ''
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const suggestions = document.querySelectorAll('.suggestion');
      console.log("suggestions", suggestions);
      suggestions.forEach((suggestion) => {
        console.log("suggestion 1 ", suggestion);
        suggestion.addEventListener('click', () => {
          console.log("suggestion 2", suggestion);
          // const searchPokemon = document.querySelector('.searchPokemon') as HTMLInputElement
          // searchPokemon.value = suggestion.textContent as string
          // suggestion.remove()
        });
      });
    });

    const suggestionContainer = document.querySelector('.suggestions');
    if (suggestionContainer) {
      observer.observe(suggestionContainer, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
    <div onClick={maskSuggestion} className="containerPokedex">
      <div className="head">
        <div className="title">
          <h1>Pokedex</h1>
          <p>recherche un pokemon par son numero ou son nom</p>
        </div>
        <div className="search">
              <input 
                type="text" 
                className="searchPokemon" 
                placeholder=" Choose a pokemon" 
                onChange={handleAutocomplete} />

              <ul className="suggestions">

              </ul>
        </div>
      </div>
      <div className="pokemonContainer">
        
        {pokemons && (
          <div className="pokedexGrid">
            {pokemons.map((pokemon: object,index: number) => (
              <ListCartPokemon key={index} pokemon={pokemon}  />
            ))}
          </div>
        )}
        <button className="showMore" onClick={handleShowMore}>Show more</button>
      </div>
    </div>
      {/* <PokemonType type={'grass'} /> */}
    </>
  )
}

export default App
