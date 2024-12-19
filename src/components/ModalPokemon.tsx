import {useEffect,useState} from 'react'
import PokemonType from './PokemonType'
import SvgComponent from './SvgComponent'
interface Pokemon {
    name: string,
    url: string
}

export default function ModalPokemon({url, closeModal}: {url: Pokemon, closeModal: () => void}) {
    const [pokemon, setPokemon] = useState<{ name?: string, stats?: object[{}], types?: object[{}], id?: number}>({})
    const  urlpokemon = url.url
    useEffect(() => {
        fetch(urlpokemon)
        .then(response => response.json())
        .then(data => {
            setPokemon({
                name: data.name,
                stats: data.stats,
                types: data.types,
                id: data.id
            });
            console.log(data)
        })
        .catch(error => {
            console.error('Error fetching the Pokémon data:', error);
        });
    }, [url])
    useEffect(() => {
    }, [pokemon]);
    return (
        <div  onClick={closeModal} className='modalPokemon'>
            <div onClick={(e) => e.stopPropagation()}
             className="pokemonCenter">
                <SvgComponent types={pokemon.types}/>
                <div className="hp">
                    <p className='nameHp'>HP : </p>
                    <p className='valueHp'>{pokemon.stats?.[0]?.base_stat}</p>
                </div>
                <div className="pokemonCenterCard">
                    
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} alt={pokemon.name} />
                    <h3>{pokemon.name}</h3>
                    <PokemonType type={pokemon.types} />
                </div>
                <div className="stats">
                    <div className="attack">
                        <p>{pokemon.stats?.[1]?.base_stat}</p>
                        <h4>Attack</h4>
                    </div>
                    <div className="defense">
                        <p>{pokemon.stats?.[2]?.base_stat}</p>
                        <h4>Defense</h4>
                    </div>
                    <div className="speed">
                        <p>{pokemon.stats?.[5]?.base_stat}</p>
                        <h4>Speed</h4>
                    </div>
                </div>
                <button className='FichePokemon' onClick={closeModal}>voir plus</button>
            </div>
           
        </div>
    )
}
