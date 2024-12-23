import { useState, useEffect } from "react"
import ListCartPokemon from "../components/ListCartPokemon"
import '../assets/scss/components/PokemonContainer.scss'
import dataNames from '../../public/pokemons.json'

function App() {
  const [pokemons, setPokemons] = useState<{name: string, url: string}[]>()
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
        setPokemons(prevPokemons => [...(prevPokemons || []), ...data.results])
        setNextUrl(data.next)
      })
    }
  }

  const handleAutocomplete = () => {
    const searchPokemon = document.querySelector('.searchPokemon') as HTMLInputElement
    const suggestionContainer = document.querySelector('.suggestions') as HTMLUListElement
    const value = searchPokemon.value
    if (value.length > 0) {
      // console.log("value",catchData)
      const suggestions = catchData.filter((name: string) => name.toLowerCase().includes(value.toLowerCase()))
      suggestionContainer.innerHTML = ''
      suggestions.forEach((suggestion) => {
        const li = document.createElement('li')
        li.className = 'suggestion'
        li.textContent = suggestion
        suggestionContainer.appendChild(li)
      })
    } else {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
      .then(response => response.json())
      .then(data => {
        setPokemons(data.results)
        setNextUrl(data.next)
        setCatchData(dataNames)
      })
      maskSuggestion()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    const searchPokemon = document.querySelector('.searchPokemon') as HTMLInputElement
    searchPokemon.value = suggestion
    console.log("suggestion",searchPokemon.value )
    fetch(`https://pokeapi.co/api/v2/pokemon/${suggestion.toLowerCase()}`)
    .then(response => response.json())
    .then(data => {
      console.log("data - 1",data)
      maskSuggestion()
      setPokemons([
        {
          name: data.name,
          url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`
        }
      ])
    })
    
  }

  const maskSuggestion = () => {
    const suggestionContainer = document.querySelector('.suggestions') as HTMLUListElement
    suggestionContainer.innerHTML = ''
  }

  useEffect(() => {
    const suggestionContainer = document.querySelector('.suggestions') as HTMLUListElement
    suggestionContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('suggestion')) {
        handleSuggestionClick(target.textContent as string)
      }
    })
  }, [])

  console.log(pokemons)

  return (
    <>
    <div onClick={maskSuggestion} className="containerPokedex">
      <div className="head">
        <div onClick={maskSuggestion} className="title">
          <h1>Pokedex</h1>
          <p>Find a pokemon by name</p>
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
            {pokemons.map((pokemon: {name: string, url: string},index: number) => (
                <ListCartPokemon key={index} name={pokemon.name} url={pokemon.url} />
            ))}
          </div>
        )}
        <button className="showMore" onClick={handleShowMore}>Show more</button>
      </div>
    </div>
    </>
  )
}

export default App
