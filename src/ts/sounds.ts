interface SoundInfo {
    audio?: HTMLAudioElement;
    loaded: boolean;
    loadPromise?: Promise<void>;
}

class _Sounds {
    audios: {[key: string]: SoundInfo} = {};

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
}

export const Sounds = new _Sounds();