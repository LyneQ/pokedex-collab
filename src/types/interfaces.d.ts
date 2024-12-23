interface PokemonData {
    name: string;
    id: number;
    sprites: {
        front_default: string;
        front_shiny: string;
    },
    abilities: {
        ability: {
            name: string;
        }
    }[],
    weight: number;
    height: number;
    flavor_text_entries: {
        flavor_text: string;
        language: {
            name: string;
        }
    }[]
    genera: {
        genus: string;
        language: {
            name: string;
        }
    }[]
    stats: {
        base_stat: number;
        stat: {
            name: string;
        }
    }[]
    types: {
        slot: number;
        type: {
            name: string;
            url: string;
        }
    }[]
    damage_relations: {
        double_damage_from: {
            name: string;
        }[]
    };
}

interface EvolutionChain {
    species: string;
    url: string;
}

interface Types {
    type?: string;
    url?: string;
}

interface PokemonUrl {
    url: string
}

interface Type {
    slot: number,
    type: { name: string, url: string }
}

export type {PokemonData, PokemonUrl, evolutionChain, Types, Type};