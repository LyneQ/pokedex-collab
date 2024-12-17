import { useState, useEffect } from "react"
import ListCartPokemon from "../components/ListCartPokemon"
import '../assets/scss/components/PokemonContainer.scss'
import IconSearch from '../../public/icons8-search-50.png'
//https://pokeapi.co/api/v2/pokemon?limit=20&offset=0

function App() {
  const [pokemons, setPokemons] = useState<object[]>([{name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/'}])
  const [nextUrl, setNextUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
    .then(response => response.json())
    .then(data => {
      console.log("data",data.next)
      setPokemons(data.results)
      setNextUrl(data.next)
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

  return (
    <>
    <div className="containerPokedex">
      <div className="search">
            <input type="text" className="searchPokemon" />
            <button className="searchButton"><img src={IconSearch} alt="Icon Search" /></button>
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
