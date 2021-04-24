const disableDefaultKeys = new Set(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]);

class _Keys {
    #pressedKeys: Set<string> = new Set();
    #pressedThisFrame: Set<string> = new Set();
    #releasedThisFrame: Set<string> = new Set();

    setUp() {
        // Thought: Should this be adding to a number rather than triggering a boolean? Eh.
        document.addEventListener('keydown', (evt) => {
            this.#pressedKeys.add(evt.code);
            this.#pressedThisFrame.add(evt.code);

            // Also disable scrolling
            if (disableDefaultKeys.has(evt.code)) {
                evt.preventDefault();
            }
        });
        document.addEventListener('keyup', (evt) => {
            this.#pressedKeys.delete(evt.code);
            this.#releasedThisFrame.add(evt.code);
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