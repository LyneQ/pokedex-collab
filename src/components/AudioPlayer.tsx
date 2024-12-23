import { useRef, useState } from "react";
import "../assets/scss/components/AudioPlayer.scss";
const AudioPlayer = ({ audioLink }: { audioLink: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Play/Pause toggle
    const togglePlayPause = () => {
        const audio = audioRef.current;

        if (isPlaying) {
            audio?.pause();
        } else {
            audio?.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Update progress bar
    const updateProgress = () => {
        const audio = audioRef.current;
        const progressValue = (audio?.currentTime ?? 0) / (audio?.duration ?? 1) * 100;
        setProgress(progressValue);
    };

    // Seek bar functionality
    const seekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = (Number(e.target.value) / 100) * audio.duration;
            setProgress(Number(e.target.value));
        }
    };

    return (
        <div className="audio-player">
            {/* Play/Pause Button */}
            <button className="play-pause" onClick={togglePlayPause}>
                {isPlaying ? "Pause" : "Play"}
            </button>

            {/* Progress Bar */}
            <input
                type="range"
                className="seek-bar"
                value={progress}
                onChange={seekAudio}
            />

            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={audioLink}
                onTimeUpdate={updateProgress}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};

export default AudioPlayer;