import styles from './style.module.scss';

import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useRef, useEffect, useState } from 'react';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { RiPlayList2Fill } from 'react-icons/ri';
import { IoCloseOutline } from "react-icons/io5";
import Sidebar from 'react-sidebar';
import React from 'react';

export function Player() {
    const { episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];

    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });

    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    return (
        <div className={styles.playerContainer}>
            <div className={styles.wrapper}>
                <header>
                    <img src="/playing.svg" alt="Tocando Agora" />
                    <strong>Tocando agora</strong>

                </header>

                {episode ? (
                    <div className={styles.currentEpisode}>
                        <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                )}

                <footer className={!episode ? styles.empty : ''}>
                    <div className={styles.progress}>
                        <span>{convertDurationToTimeString(progress)}</span>
                        <div className={styles.slider}>
                            {episode ? (
                                <Slider
                                    trackStyle={{ backgroundColor: '#04d361' }}
                                    railStyle={{ backgroundColor: '#9f75ff' }}
                                    handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                    max={episode.duration}
                                    value={progress}
                                    onChange={handleSeek}
                                />
                            ) : (
                                <div className={styles.emptySlider}></div>
                            )
                            }
                        </div>
                        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                    </div>

                    {episode && (
                        <audio
                            src={episode.url}
                            autoPlay ref={audioRef}
                            loop={isLooping}
                            onEnded={handleEpisodeEnded}
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                            onLoadedMetadata={setupProgressListener}
                        />
                    )}

                    <div className={styles.buttons}>
                        <button disabled={!episode || episodeList.length === 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
                            <img src="/shuffle.svg" alt="Embaralhar" />
                        </button>
                        <button disabled={!episode || !hasPrevious} onClick={playPrevious}>
                            <img src="/play-previous.svg" alt="Tocar Anterior" />
                        </button>
                        <button className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                            {isPlaying
                                ? <img src="/pause.svg" alt="Tocar" />
                                : <img src="/play.svg" alt="Pausar" />}
                        </button>
                        <button disabled={!episode || !hasNext} onClick={playNext}>
                            <img src="/play-next.svg" alt="Tocar Próximo" />
                        </button>
                        <button disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
                            <img src="/repeat.svg" alt="Repetir" />
                        </button>
                    </div>
                </footer>
            </div>

        </div >
    );
}
