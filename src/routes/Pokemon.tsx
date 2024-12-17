import { useParams } from 'react-router';
import {useEffect, useState} from "react";

export default function Pokemon() {

    const params = useParams();
    const [pokemonData, setPokemonData] = useState(null);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemonData(data);
            });
    }, []);

    return (
        <>
            <h1>{ }</h1>
            <img src={`https://www.pokebip.com/pokedex-images/300/${params.id}.png?v=ev-blueberry`} alt={'test'}/>

        </>
    );
};
