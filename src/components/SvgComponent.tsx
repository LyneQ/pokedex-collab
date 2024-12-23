export default function SvgComponent({ types }: { types: any[] }) {
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

    if (!types) return null;

    const typeColors = types.map(t => colors.find(c => c.type === t.type.name)?.hex).filter(Boolean);
    const gradientId = 'typeGradient';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="svgComponent">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    {typeColors.map((color, index) => (
                        <stop key={index} offset={`${(index / (typeColors.length - 1)) * 100}%`} stopColor={color} />
                    ))}
                </linearGradient>
            </defs>
            <path fill={`url(#${gradientId})`} fillOpacity="1" d="M0,96L40,117.3C80,139,160,181,240,181.3C320,181,400,139,480,122.7C560,107,640,117,720,144C800,171,880,213,960,245.3C1040,277,1120,299,1200,282.7C1280,267,1360,213,1400,186.7L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
        </svg>
    );
}