import {useEffect, useState} from 'react'
import PokemonType from "../components/PokemonType"
//https://www.pokebip.com/pokedex-images/300/1.png?v=ev-blueberry

export default function ListCartPokemon({pokemon}: {pokemon: any}) {
    const [types, setTypes] = useState<object[]>([{type: 'grass', url: 'https://pokeapi.co/api/v2/type/12/'}])
    
    const { url} = pokemon
    const pokemonId = pokemon.url.split('/')[6] 
    const num = parseInt(pokemonId)

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const {types} = data
            setTypes(types)
        })
    }, [url])

    const formattedId = String(num).padStart(4, '0')



  return (
    <div className="pokemonCart">
        <img src={`https://www.pokebip.com/pokedex-images/300/${pokemonId}.png?v=ev-blueberry` }  alt={pokemon.name} />
        <h3>{pokemon.name} #{formattedId}</h3>
        <PokemonType type={types}  />
    </div>
  )
}
