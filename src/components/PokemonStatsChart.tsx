// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import CanvasJSReact from '@canvasjs/react-charts';
import type {PokemonData} from '../types/interfaces';


const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default function PokemonStatsChart({pokemonData}: {pokemonData: PokemonData}) {
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
        <CanvasJSChart options={options}/>

    );
}