import {useEffect, useState} from 'react'
import { createPortal } from 'react-dom'
import PokemonType from "../components/PokemonType"
import ModalPokemon from './ModalPokemon'
//https://www.pokebip.com/pokedex-images/300/1.png?v=ev-blueberry

export default function ListCartPokemon({pokemon}: {pokemon: any}) {
    const [types, setTypes] = useState<object[]>([{type: 'grass', url: 'https://pokeapi.co/api/v2/type/12/'}])
    const [pokemonModal, setPokemonModal] = useState<boolean>(false)
    // console.log(pokemon.url )
    //chunk-MVRAC76T.js?v=a57fa920:19464 Uncaught TypeError: Cannot read properties of undefined (reading 'split')
    // at ListCartPokemon (ListCartPokemon.tsx:11:35)
    // const pokemonId = `${pokemon.url}`.split('/')[6] 

    // VM4734:1 Uncaught (in promise) SyntaxError: Unexpected token 'N', "Not Found" is not valid JSON
    // at ListCartPokemon.tsx:17
    const fetchinId = () => {
      console.log("pokemon.url",pokemon.url)
        fetch(pokemon.url)
        .then(response => response.json())
        .then(data => {
          console.log("data",data)
           const id = data.id
            console.log("id",id)
            return id
        })
    }
    const id = pokemon.url.split('/')[6]
    useEffect(() => {
        fetch(pokemon.url)
        .then(response => response.json())
        .then(data => {
         
            if(data.types === undefined) {
              console.log("data false")
              
              console.log("id-1",id)  
              fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
              .then(response => response.json())
              .then(data => {
                  setTypes({
                      types: data.types,
                      id :  data.id
                  })
              
              })
            }else {
                setTypes({
                    types: data.types,
                    id :  data.id
                })
                
            }
            
        })
    }, [id])
    const num = parseInt(types.id)
    const formattedId = String(num).padStart(4, '0')
    
    return (
      
      <>
        <div onClick={() => setPokemonModal(true)} className="pokemonCart">
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${types.id}.png`} alt={pokemon.name} />
            <h3>{pokemon.name} #{formattedId}</h3>
            <PokemonType type={types.types} />
        </div>
        {pokemonModal && createPortal(
          
            <ModalPokemon url={pokemon.url} closeModal={() => setPokemonModal(false)} />, 
            document.body
        )}
      </>
    )
}