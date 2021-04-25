interface SoundInfo {
    audio?: HTMLAudioElement;
    loaded: boolean;
    loadPromise?: Promise<void>;
}

class _Sounds {
    audios: {[key: string]: SoundInfo} = {};

    curSong?: HTMLAudioElement;

    /**
     * Asynchronously fetches an audio.
     */
    loadSound({name, path} : {name: string, path: string}) {
        const promise = new Promise<void>((resolve) => {
            if (this.audios.hasOwnProperty(name)) {
                throw new Error(`Already loaded sound ${name}.`);
            }

            if (!path.endsWith('/')) {
                path = path + '/';
            }
            const audioPath = `${path}${name}.mp3`;

            this.audios[name] = {
                loaded: false,
                audio: undefined,
                loadPromise: promise,
            };

            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.audios[name].audio = audio;
                this.audios[name].loaded = true;
                resolve();
            }
            audio.onerror = () => {
                throw new Error(`Error loading audio ${name}.`);
            }
            audio.src = audioPath;
        });
        return promise;
    }

    playSound(name: string) {
        const audio = (this.audios[name].audio?.cloneNode() as HTMLAudioElement);
        if (audio == null) {
            return;
        }
        if (name == 'jump') {
            audio.volume = 0.3;
        }
        if (name == 'shoot') {
            audio.volume = 0.4;
        }
        if (name == 'shoot2') {
            audio.volume = 0.2;
        }
        audio.play();
    }

    // TODO: Use the same position.
    async setSong(songName: string) {
        this.curSong?.pause();

        const audioInfo = this.audios[songName];
        if (audioInfo == null) {
            // Setting an invalid song name is a way to stop audio from playing.
            return;
        }

        // Ensure the song is loaded
        await audioInfo.loadPromise;

        const audio = (audioInfo.audio?.cloneNode() as HTMLAudioElement);
        if (audio == null) {
            return;
        }

        audio.onended = () => {
            // Only loop if it's the currently playing song
            if (audio != this.curSong) {
                return;
            }
            audio.play();
        }
        audio.volume = 0.5;

        audio.play();

        this.curSong = audio;
    }
}

export const Sounds = new _Sounds();