import {Link, useParams} from 'react-router';
import {MouseEvent, SetStateAction, useEffect, useState} from 'react';
import type {evolutionChain, PokemonData} from '../types/interfaces';
import '../assets/scss/routes/Pokemon.scss';
import PokemonType from "../components/PokemonType.tsx";
import AudioPlayer from "../components/AudioPlayer.tsx";
import PokemonStatsChart from "../components/PokemonStatsChart.tsx";
import {JSX} from 'react/jsx-runtime';

export default function Pokemon() {
    const params = useParams();
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
    const [pokemonSpecies, setPokemonSpecies] = useState<PokemonData | null>(null);
    const [pokemonWeakness, setPokemonWeakness] = useState<string[]>([]);
    const [evolutionChain, setEvolutionChain] = useState<evolutionChain[]>([]);
    const [firstEvolution, setFirstEvolution] = useState<JSX.Element[]>([]);
    const [secondEvolution, setSecondEvolution] = useState<JSX.Element[]>([]);
    const [thirdEvolution, setThirdEvolution] = useState<JSX.Element[]>([]);
    const pokemonId = pokemonData?.id;


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

        fetchData().then(r => r);
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

        getWeakness().then(r =>r);
    }, [params.id]);
    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${params.id}`)
            .then((response) => response.json())
            .then((data) => {
                fetch(data.evolution_chain.url)
                    .then((response) => response.json())
                    .then(async (data) => {
                        const evolutionChain: SetStateAction<evolutionChain[]> = [];
                        const getEvolutionChain = async (evolution: {
                            species: { name: string; };
                            evolves_to: never;
                        }) => {
                            const id = await getPokemonIdFromName(evolution.species.name);
                            const previousEvolution = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + id)
                                .then(response => response.json())
                                .then(data => data.evolves_from_species);

                            evolutionChain.push({
                                species: evolution.species.name,
                                previousEvolution: evolutionChain.length > 0 ? previousEvolution.name : null,
                                url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                                onClickUrl: `/pokemon/${id}`
                            });
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            for await (const evo of evolution.evolves_to) {
                                await getEvolutionChain(evo);
                            }
                        };
                        await getEvolutionChain(data.chain);
                        setEvolutionChain(evolutionChain);
                    });
            });
    }, [params.id]);
    useEffect(() => {
        const firstEvolution: SetStateAction<JSX.Element[]> = [];
        const secondEvolution: SetStateAction<JSX.Element[]> = [];
        const thirdEvolution: SetStateAction<JSX.Element[]> = [];

        for (const evolution of evolutionChain) {
            const evolutionElement = (
                <li key={evolution.species}>
                    <Link to={evolution.onClickUrl}>
                        <p className={'evolution_line_container_item_name'}>{evolution.species}</p>
                        <img src={evolution.url} className="evolution_line_container_item_image"
                             alt={evolution.species}/>
                    </Link>
                </li>
            );

            if (evolution.previousEvolution === null) {
                firstEvolution.push(evolutionElement);
            } else if (evolution.previousEvolution === evolutionChain[0].species) {
                secondEvolution.push(evolutionElement);
            } else {
                thirdEvolution.push(evolutionElement);
            }
        }

        setFirstEvolution(firstEvolution);
        setSecondEvolution(secondEvolution);
        setThirdEvolution(thirdEvolution);
    }, [evolutionChain]);

    const toggleShiny = (e: MouseEvent<HTMLImageElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        e.currentTarget.src.includes('shiny') ?
            e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${params.id}.png` :
            e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${params.id}.png`;
    }

    return (
        <>
            <section className={'pokemon_container'}>
                <div className={'pokemon_container_card'}>
                    <h1 className={'pokemon_name'}>{pokemonData?.name}</h1>
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                        className={'pokemon_image'}
                        onClick={toggleShiny}
                        alt={'test'}/>
                    <AudioPlayer audioLink={`https://pokemoncries.com/cries-old/${params.id}.mp3`}/>
                    <button><Link to={'/'}>Back</Link></button>
                </div>
                <div className={'pokemon_container_information'}>
                    <div>
                        <h2>about <span>{pokemonData?.name}</span></h2>
                        <p className={'pokemon_container_information_description'}>
                            {pokemonSpecies?.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text.replace('\f', '')}
                        </p>
                    </div>
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
                                    <p>{pokemonData?.weight ? pokemonData.weight : 'N/A'} Kg</p>
                                </div>
                                <div className={'pokemon_container_information_ability_list_item'}>
                                    <h5> height: </h5>
                                    <p>{pokemonData?.height ? pokemonData.height / 10 : 'N/A'} m</p>
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
                    { pokemonData ? <PokemonStatsChart pokemonData={pokemonData}/> : null}
                </div>
            </section>
            <section className={'pokemon_container'}>
                <div className={'evolution_line'}>
                    <h2>Evolution Line</h2>
                    <div className={'evolution_line_container'}>

                        <ul className={'first_evolution evolution_line_container_item'}>
                            {firstEvolution.map((item, index) => (
                                <div key={index}>
                                    {item}
                                </div>
                            ))
                            }</ul>
                        {secondEvolution.length > 0 && <p className={'evolution_line-arrow'}>→</p>}

                        <ul className={'second_evolution evolution_line_container_item'}>
                            {secondEvolution.map((item, index) => (
                                <div key={index}>
                                    {item}
                                </div>
                            ))
                            }</ul>
                        {thirdEvolution.length > 0 && <p className={'evolution_line-arrow'}>→</p>}
                        <ul className={'third_evolution evolution_line_container_item'}>
                            {thirdEvolution.map((item, index) => (
                                <div key={index}>
                                    {item}
                                </div>
                            ))
                            }</ul>
                    </div>
                </div>
            </section>
        </>
    );
}