import {useEffect, useState} from 'react'
import { createPortal } from 'react-dom'
import PokemonType from "../components/PokemonType"
import ModalPokemon from './ModalPokemon'
import {Type} from "../types/interfaces";

export default function ListCartPokemon(pokemon: {name: string, url: string}) {
    const [types, setTypes] = useState<Type[]>()
    const [pokemonModal, setPokemonModal] = useState<boolean>(false)

    const id = pokemon.url.split('/')[6]
    useEffect(() => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(data => {

                if(data.types === undefined) {
                    console.log("data false")

                    console.log("id-1",id)
                    console.log(data)
                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then(response => response.json())
                        .then(data => {
                            setTypes(data.types)

                        })
                } else {
                    setTypes(data.types)
                }

            })
    }, [id])
    const formattedId = String(id).padStart(4, '0')

    console.log(types)
    return (
        <>
            <div onClick={() => setPokemonModal(true)} className="pokemonCart">
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`} alt={pokemon.name} />
                <h3>{pokemon.name} #{formattedId}</h3>
                <div className={"pokemonType"}>
                    { types?.map(( data: Type, index: number) => {
                        return <PokemonType type={data.type.name} key={index} />
                    })}
                </div>
            </div>
            {pokemonModal && createPortal(
                <ModalPokemon url={pokemon.url} closeModal={() => setPokemonModal(false)} />,
                document.body
            )}
        </>
    )
}