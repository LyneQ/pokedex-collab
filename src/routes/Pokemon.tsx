import {useParams} from 'react-router';
import {useEffect, useState} from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import CanvasJSReact from '@canvasjs/react-charts';
import type {PokemonData, evolutionChain} from '../types/interfaces';
import '../assets/scss/routes/Pokemon.scss';
import PokemonType from "../components/PokemonType.tsx";
import AudioPlayer from "../components/AudioPlayer.tsx";


const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Pokemon() {
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
                        const evolutionChain = [];
                        let current = data.chain;
                        while (current) {
                            const name = current.species.name;
                            const id = await getPokemonIdFromName(name);
                            evolutionChain.push({
                                species: name,
                                url: `https://www.pokebip.com/pokedex-images/300/${id}.png?v=ev-blueberry`
                            });
                            current = current.evolves_to[0];
                        }
                        setEvolutionChain(evolutionChain);
                    });
            });
    }, [pokemonData]);

    const options = {
        title: {
            text: "Stats chart",
            fontColor: "white",
        },
        backgroundColor: "transparent",
        axisX: {
            labelFontColor: "white",
            lineColor: "white",
            tickColor: "white"
        },
        axisY: {
            labelFontColor: "white",
            lineColor: "white",
            tickColor: "white"
        },
        colorSet: "customColorSet",
        data: [
            {
                type: "column",
                dataPoints: [
                    {label: "HP", y: pokemonData?.stats[0].base_stat},
                    {label: "Attack", y: pokemonData?.stats[1].base_stat},
                    {label: "Defense", y: pokemonData?.stats[2].base_stat},
                    {label: "Special Attack", y: pokemonData?.stats[3].base_stat},
                    {label: "Special Defense", y: pokemonData?.stats[4].base_stat},
                    {label: "Speed", y: pokemonData?.stats[5].base_stat}
                ]
            }
        ]
    };
    CanvasJS.addColorSet("customColorSet", [
        "#FF5733", // Color for HP
        "#33FF57", // Color for Attack
        "#3357FF", // Color for Defense
        "#FF33A1", // Color for Special Attack
        "#A133FF", // Color for Special Defense
        "#33FFF5"  // Color for Speed
    ]);

    return (
        <>
            <section className={'pokemon_container'}>
                <div className={'pokemon_container_card'}>
                    <h1 className={'pokemon_name'}>{pokemonData?.name}</h1>
                    <img src={`https://www.pokebip.com/pokedex-images/300/${params.id}.png?v=ev-blueberry\``}
                         className={'pokemon_image'}
                         alt={`image representing ${pokemonData?.name}`}/>
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
                    <CanvasJSChart options={options}/>
                </div>
            </section>

            <section className={'pokemon_container'}>
                <div className={'evolution_line'}>
                    <h2>Evolution Line</h2>
                    <div className={'evolution_line_container'}>
                        {evolutionChain.map((evolution) => (
                            <div className={'evolution_line_container_item'} key={evolution.species}>
                                <img src={evolution.url} alt={`image representing ${evolution.species}`}
                                     className={'evolution_line_container_item_image'}/>
                                <p className={'evolution_line_container_item_name'}>{evolution.species}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}