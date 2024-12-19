import '../assets/scss/components/PokemonType.scss'


export default function PokemonType({type}: {type: {type: {name: string}}[]}) {
    
    const colors = [
        { type: 'bug', hex: "#A8B820" },
        { type: 'dark', hex: "#705848" },
        { type: 'dragon', hex: "#7038F8" },
        { type: 'electric', hex: "#F8D030" },
        { type: 'fairy', hex: "#EE99AC" },
        { type: 'fighting', hex: "#C03028" },
        { type: 'fire', hex: "#F08030" },
        { type: 'flying', hex: "#A890F0" },
        { type: 'ghost', hex: "#705898" },
        { type: 'grass', hex: "#78C850" },
        { type: 'ground', hex: "#E0C068" },
        { type: 'ice', hex: "#98D8D8" },
        { type: 'normal', hex: "#A8A878" },
        { type: 'poison', hex: "#A040A0" },
        { type: 'psychic', hex: "#F85888" },
        { type: 'rock', hex: "#B8A038" },
        { type: 'steel', hex: "#B8B8D0" },
        { type: 'water', hex: "#6890F0" }
    ];

    
    if (!type) return null;
    return (
        <div className="pokemonType">
            {type.map((t: any, index: number) => {
                const color = colors.find(c => c.type === t.type.name)
                return (
                    <span key={index} className="type" style={{backgroundColor: color?.hex}}>
                        {t.type.name}
                </span>
            )
        })}
        </div>
    )
}
