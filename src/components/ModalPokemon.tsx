import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import PokemonType from './PokemonType'
import SvgComponent from './SvgComponent'
import type { PokemonData } from '../types/interfaces'

export default function ModalPokemon({url, closeModal}: {url: string, closeModal: () => void}) {
    const [pokemon, setPokemon] = useState<PokemonData>()
    const [versionPkemon, setVersionPokemon] = useState<Array<{type: string, img: string}>>([])
    const [versionIndex, setVersionIndex] = useState<number>(0)
    const navigate = useNavigate();
    const urlpokemon = url
    console.log("urlpokemon - 1",urlpokemon)
    useEffect(() => {
        console.log("urlpokemon - 2",urlpokemon)
        fetch(urlpokemon)
        .then(response => response.json())
        .then(data => {
            setPokemon({
                abilities: [],
                damage_relations: {double_damage_from: []},
                flavor_text_entries: [],
                genera: [],
                height: 0,
                sprites: {front_default: "", front_shiny: ""},
                weight: 0,
                name: data.name,
                stats: data.stats,
                types: data.types,
                id: data.id
            });
            console.log("pokmo",pokemon)
            setVersionPokemon([
                {
                    type: 'normal',
                    img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
                },
                {
                    type: 'shiny',
                    img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${data.id}.png`
                }
            ])
            
        })
        .catch(error => {
            console.error('Error fetching the Pokémon data:', error);
        });
    }, [])
    
    function toggleimage(index: number) {
        setVersionIndex((prevIndex) => (prevIndex + index + versionPkemon.length) % versionPkemon.length)
    }

    const currentVersion = versionPkemon[versionIndex];
    const handleButtonClick = () => {
        if (pokemon!.id) {
          navigate(`/pokemon/${pokemon!.id}`);
        }
      };

    return (
        <div  onClick={closeModal} className='modalPokemon'>
            <div onClick={(e) => e.stopPropagation()}
             className="pokemonCenter pokemon-front">
                {pokemon && <SvgComponent types={pokemon.types}/>}
                <div className="hp">
                    <p className='nameHp'>HP : </p>
                    <p className='valueHp'>{pokemon?.stats?.[0]?.base_stat}</p>
                </div>
                <div onClick = {() => toggleimage(1)} 
                 className="pokemonCenterCard">
                    {currentVersion && (
                        <>
                            <p className='name'><span>{currentVersion.type}</span> </p>
                            <img src={currentVersion.img} alt={pokemon?.name} />
                        </>
                    )}
                    <h3>{pokemon?.name}</h3>
                    <div className={"pokemonType"}>
                    { pokemon?.types?.map(( data: any, index: number) => {
                        return <PokemonType type={data.type.name} key={index} />
                    })}
                </div>
                    
                </div>
                <div className="stats">
                    <div className="attack">
                        <p>{pokemon?.stats?.[1]?.base_stat}</p>
                        <h4>Attack</h4>
                    </div>
                    <div className="defense">
                        <p>{pokemon?.stats?.[2]?.base_stat}</p>
                        <h4>Defense</h4>
                    </div>
                    <div className="speed">
                        <p>{pokemon?.stats?.[5]?.base_stat}</p>
                        <h4>Speed</h4>
                    </div>
                </div>
                <button className='FichePokemon' onClick={handleButtonClick} >show more</button>
            </div>
           
        </div>
    )
}
