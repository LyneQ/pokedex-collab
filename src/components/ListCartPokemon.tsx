import {useEffect, useState} from 'react'
import { createPortal } from 'react-dom'
import PokemonType from "../components/PokemonType"
import ModalPokemon from './ModalPokemon'
//https://www.pokebip.com/pokedex-images/300/1.png?v=ev-blueberry

export default function ListCartPokemon({pokemon}: {pokemon: any}) {
    const [types, setTypes] = useState<object[]>([{type: 'grass', url: 'https://pokeapi.co/api/v2/type/12/'}])
    const [pokemonModal, setPokemonModal] = useState<boolean>(false)
    const { url } = pokemon
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
      <>
        <div onClick={() => setPokemonModal(true)} className="pokemonCart">
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`} alt={pokemon.name} />
            <h3>{pokemon.name} #{formattedId}</h3>
            <PokemonType type={types} />
        </div>
        {pokemonModal && createPortal(
            <ModalPokemon url={pokemon} closeModal={() => setPokemonModal(false)} />, 
            document.body
        )}
      </>
    )
}
