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

                if (name == 'jump') {
                    audio.volume = 0.3;
                }
                resolve();
            }
            audio.onerror = () => {
                throw new Error(`Error loading audio ${name}.`);
            }
            audio.src = audioPath;
        });
        return promise;
    }
}

export const Sounds = new _Sounds();