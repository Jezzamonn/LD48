class _Keys {
    #pressedKeys: Set<string> = new Set();
    #pressedThisFrame: Set<string> = new Set();
    #releasedThisFrame: Set<string> = new Set();

    setUp() {
        // Thought: Should this be adding to a number rather than triggering a boolean? Eh.
        document.addEventListener('keydown', (evt) => {
            console.log(`keydown: ${evt.code}`);
            this.#pressedKeys.add(evt.key);
            this.#pressedThisFrame.add(evt.key);
        });
        document.addEventListener('keyup', (evt) => {
            console.log(`keyup: ${evt.code}`);
            this.#pressedKeys.delete(evt.key);
            this.#releasedThisFrame.add(evt.key);
        });
    }

    resetFrame() {
        this.#pressedThisFrame.clear();
        this.#releasedThisFrame.clear();
    }

    isPressed(keyCode: string): boolean {
        return this.#pressedKeys.has(keyCode);
    }

    wasPressedThisFrame(keyCode: string): boolean {
        return this.#pressedThisFrame.has(keyCode);
    }

    wasReleasedThisFrame(keyCode: string): boolean {
        return this.#releasedThisFrame.has(keyCode);
    }

}

export const Keys = new _Keys();