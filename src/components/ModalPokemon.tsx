import {useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import PokemonType from './PokemonType'
import SvgComponent from './SvgComponent'
interface Pokemon {
    name: string,
    url: string
}

export default function ModalPokemon({url, closeModal}: {url: Pokemon, closeModal: () => void}) {
    const [pokemon, setPokemon] = useState<{ name?: string, stats?: object[{}], 
    types?: object[{}], id?: number}>({})
    const [versionPkemon, setVersionPokemon] = useState<Array<{type: string, img: string}>>([])
    const [versionIndex, setVersionIndex] = useState<number>(0)
    const navigate = useNavigate();
    console.log("pokemon.url",url)
    const urlpokemon = url
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
            console.log(pokemon)
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
            console.log(data)
        })
        .catch(error => {
            console.error('Error fetching the Pokémon data:', error);
        });
    }, [url])
    
    function toggleimage(index: number) {
        setVersionIndex((prevIndex) => (prevIndex + index + versionPkemon.length) % versionPkemon.length)
    }

    const currentVersion = versionPkemon[versionIndex];
    const handleButtonClick = () => {
        if (pokemon.id) {
          navigate(`/pokemon/${pokemon.id}`);
        }
      };

    return (
        <div  onClick={closeModal} className='modalPokemon'>
            <div onClick={(e) => e.stopPropagation()}
             className="pokemonCenter pokemon-front">
                <SvgComponent types={pokemon.types}/>
                <div className="hp">
                    <p className='nameHp'>HP : </p>
                    <p className='valueHp'>{pokemon.stats?.[0]?.base_stat}</p>
                </div>
                <div onClick = {() => toggleimage(1)} 
                 className="pokemonCenterCard">
                    {currentVersion && (
                        <>
                            <p className='name'><span>{currentVersion.type}</span> </p>
                            <img src={currentVersion.img} alt={pokemon.name} />
                        </>
                    )}
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
                <button className='FichePokemon' onClick={handleButtonClick} >voir plus</button>
            </div>
           
        </div>
    )
}
