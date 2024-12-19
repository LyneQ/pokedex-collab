import {useParams} from 'react-router';
import {SetStateAction, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';

import type {PokemonData, evolutionChain} from '../types/interfaces';
import '../assets/scss/routes/Pokemon.scss';
import PokemonType from "../components/PokemonType.tsx";
import AudioPlayer from "../components/AudioPlayer.tsx";
import PokemonStatsChart from "../assets/scss/components/PokemonStatsChart.tsx";




export default function Pokemon() {

    const navigate = useNavigate();
    const params = useParams();
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
    const [pokemonSpecies, setPokemonSpecies] = useState<PokemonData | null>(null);
    const [pokemonWeakness, setPokemonWeakness] = useState<string[]>([]);
    const [evolutionChain, setEvolutionChain] = useState<evolutionChain[]>([]);

    const getPokemonIdFromName = async (name: string) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        return data.id;
    }

    useEffect(() => {
        const fetchData = async () => {
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
            const pokemonData = await pokemonResponse.json();
            setPokemonData(pokemonData);

            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${params.id}`);
            const speciesData = await speciesResponse.json();
            setPokemonSpecies(speciesData);
        };

        fetchData();
    }, [params.id]);
    useEffect(() => {
        const getWeakness = async () => {
            const request = async (url: RequestInfo | URL) => {
                const result = await fetch(url);
                return await result.json();
            };

            const _types = await request("https://pokeapi.co/api/v2/type");
            const types = {} as { [key: string]: number };
            for (const type of _types.results) types[type.name] = 1;

            const pokemon = await request(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
            for (const pokemonType of pokemon.types) {
                const type = await request(pokemonType.type.url);
                for (const i of type.damage_relations.double_damage_from) {
                    types[i.name] *= 2;
                }
                for (const i of type.damage_relations.half_damage_from) {
                    types[i.name] /= 2;
                }
                for (const i of type.damage_relations.no_damage_from) {
                    types[i.name] *= 0;
                }
            }
            const weakness = [];
            for (const type in types) {
                if (types[type] > 1) {
                    weakness.push(type);
                }
            }

            setPokemonWeakness(weakness);
        };

        getWeakness();
    }, [params.id]);
    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${params.id}`)
            .then((response) => response.json())
            .then((data) => {
                fetch(data.evolution_chain.url)
                    .then((response) => response.json())
                    .then(async (data) => {
                        const evolutionChain: SetStateAction<evolutionChain[]> = [];
                        const getEvolutionChain = async (evolution, previousEvolution = null) => {
                            const id = await getPokemonIdFromName(evolution.species.name);

                            evolutionChain.push({
                                species: evolution.species.name,
                                previousEvolution: evolutionChain.length > 0 ? previousEvolution : null,
                                url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                                onClickUrl: `/pokemon/${id}`
                            });
                            for (const evo of evolution.evolves_to) {
                                await getEvolutionChain(evo, evolution.species.name);
                            }
                        };
                        await getEvolutionChain(data.chain);
                        setEvolutionChain(evolutionChain);
                    });
            });
    }, [pokemonData]);



    const toggleShiny = (e: any) => {
        e.target.src.includes('shiny') ?
            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${params.id}.png` :
            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${params.id}.png`;
    }

    console.log(evolutionChain)

    const pokemonId = pokemonData?.id;

    return (
        <>
            <section className={'pokemon_container'}>
                <div className={'pokemon_container_card'}>
                    <h1 className={'pokemon_name'}>{pokemonData?.name}</h1>
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${ pokemonId }.png`}
                        className={'pokemon_image'}
                        onClick={toggleShiny}
                        alt={'test'}/>
                    <AudioPlayer audioLink={`https://pokemoncries.com/cries-old/${params.id}.mp3`}/>
                </div>
                <div className={'pokemon_container_information'}>
                    <p className={'pokemon_container_information_description'}>
                        {pokemonSpecies?.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text.replace('\f', '')}
                    </p>
                    <div className={'list_container'}>
                        <div className={'pokemon_container_information_ability_list-container'}>
                            <h2>details</h2>
                            <div className={'pokemon_container_information_ability_list'}>
                                <div className={'pokemon_container_information_ability_list_item'}>
                                    <h5>Genus:</h5>
                                    <p>{pokemonSpecies?.genera.filter((genus) => genus.language.name === 'en')[0].genus}</p>
                                </div>
                                <div className={'pokemon_container_information_ability_list_item'}>
                                    <h5>Abilities:</h5>
                                    <ul>
                                        {pokemonData?.abilities.map((ability) => (
                                            <li key={ability.ability.name}>{ability.ability.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={'pokemon_container_information_ability_list_item'}>
                                    <h5> weight: </h5>
                                    <p>{pokemonData?.weight} Kg</p>
                                </div>
                                <div className={'pokemon_container_information_ability_list_item'}>
                                    <h5> height: </h5>
                                    <p>{pokemonData?.height ? pokemonData.height / 10 : pokemonData?.height} m</p>
                                </div>
                            </div>
                        </div>
                        <div className={'pokemon_container_information_stats'}>
                            <h2>Stats</h2>
                            <div className={'pokemon_container_information_stats_list'}>
                                {pokemonData?.stats.map((stat) => (
                                    <div key={stat.stat.name}
                                         className={'pokemon_container_information_stats_list_item'}>
                                        <h5>{stat.stat.name}</h5>
                                        <p>{stat.base_stat}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className={'pokemon_container pokemon_container_types'}>
                <div className={'pokemon_container_title'}>
                    <h2>Types</h2>
                    <div className={'pokemon_container_information_ability_list_type'}>
                        {pokemonData?.types.map((type) => (
                            <PokemonType type={type.type.name} key={type.type.name}/>
                        ))}
                    </div>
                    <h2>weakness</h2>
                    <div className={'pokemon_container_information_ability_list_type'}>
                        {pokemonWeakness.map((type) => (
                            <PokemonType type={type} key={type}/>
                        ))}
                    </div>
                </div>
                <div className={'pokemon_container_chart'}>
                    <PokemonStatsChart pokemonData={pokemonData}/>

                </div>
            </section>
            <section className={'pokemon_container'}>
                <div className={'evolution_line'}>
                    <h2>Evolution Line</h2>
                    <div className={'evolution_line_container'}>

                        <ul>
                            <li className={'first_evolution'}>First Evolution</li>
                            <li className={'second_evolution'}>Second Evolution</li>
                            <li className={'third_evolution'}>Third Evolution</li>
                        </ul>
                        {
                            evolutionChain.map((evolution) => (
                                <div
                                    className={`evolution_line_container_item ${evolution.previousEvolution ? `previous_to-${evolution.previousEvolution}` : ''}`}
                                    key={evolution.species}>
                                    <img src={evolution.url} alt={evolution.species}
                                         onClick={() => navigate(evolution.onClickUrl)}
                                         className={'evolution_line_container_item_image'}/>
                                    <p className={'evolution_line_container_item_name'}>{evolution.species}</p>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </section>

        </>
    );
}