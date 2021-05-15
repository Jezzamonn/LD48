interface SoundInfo {
    audio?: HTMLAudioElement;
    loaded: boolean;
    loadPromise?: Promise<void>;
}

enum MuteState {
    PLAY_ALL = 0,
    MUSIC_OFF = 1,
    ALL_OFF = 2,
}

class _Sounds {
    audios: {[key: string]: SoundInfo} = {};

    curSong?: HTMLAudioElement;
    curSongName?: string;
    muteState = MuteState.PLAY_ALL;

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

    playSound(name: string, {volume = 1}: {volume?: number} = {}) {
        if (this.muteState == MuteState.ALL_OFF) {
            return;
        }

        const audio = (this.audios[name].audio?.cloneNode() as HTMLAudioElement);
        if (audio == null) {
            return;
        }
        if (name == 'jump') {
            audio.volume = 0.12;
        }
        if (name == 'land') {
            audio.volume = 0.4;
        }
        if (name == 'shoot') {
            audio.volume = 0.18;
        }
        if (name == 'shoot2') {
            audio.volume = 0.2;
        }
        if (name == 'hit') {
            audio.volume = 0.25;
        }
        if (name == 'explosion') {
            audio.volume = 0.3;
        }
        if (name == 'hurt') {
            audio.volume = 0.4;
        }
        audio.volume *= volume;
        audio.play();
    }

    /** We still run the logic here when muted, so that we can update things when unmuted. */
    async setSong(songName: string) {
        if (this.curSongName == songName) {
            return;
        }

        const songPos = this.curSong?.currentTime;
        const lastSongName = this.curSongName;

        this.curSong?.pause();
        this.curSong = undefined;
        this.curSongName = undefined;

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

        audio.volume = 0.5;
        audio.loop = true;

        if (lastSongName?.slice(0, 4) == songName.slice(0, 4) && songPos) {
            audio.currentTime = songPos;
        }

        if (this.muteState == MuteState.PLAY_ALL) {
            audio.play();
        }

        this.curSong = audio;
        this.curSongName = songName;
    }

    loadMuteState() {
        const storedMuteString = window.sessionStorage.getItem('mute') ?? "";

        let muteState = parseInt(storedMuteString);
        if (muteState != MuteState.PLAY_ALL &&
            muteState != MuteState.MUSIC_OFF &&
            muteState != MuteState.ALL_OFF) {

            muteState = MuteState.PLAY_ALL;
        }
        this.muteState = muteState;
    }

    toggleMute() {
        // TODO: Also save this to session storage
        switch (this.muteState) {
            case MuteState.PLAY_ALL:
                this.muteState = MuteState.MUSIC_OFF;
                break;
            case MuteState.MUSIC_OFF:
                this.muteState = MuteState.ALL_OFF;
                break;
            case MuteState.ALL_OFF:
            default:
                this.muteState = MuteState.PLAY_ALL;
                break;
        }
        window.sessionStorage.setItem('mute', this.muteState.toString());
        this.updateSoundMutedness();
    }

    updateSoundMutedness() {
        switch (this.muteState) {
            case MuteState.PLAY_ALL:
                this.curSong?.play();
                break;
            case MuteState.MUSIC_OFF:
            case MuteState.ALL_OFF:
                this.curSong?.pause();
                break;
        }
    }
}

export const Sounds = new _Sounds();