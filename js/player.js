export class ChaseController {
  constructor({ onMove, onJump } = {}) {
    this.onMove = onMove ?? (() => {});
    this.onJump = onJump ?? (() => {});
    this.enabled = false;

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  mount() {
    if (this.enabled) return;

    this.enabled = true;
    window.addEventListener("keydown", this.handleKeyDown);
  }

  unmount() {
    if (!this.enabled) return;

    this.enabled = false;
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();

    if (["arrowleft", "a"].includes(key)) {
      event.preventDefault();
      this.onMove(-1);
      return;
    }

    if (["arrowright", "d"].includes(key)) {
      event.preventDefault();
      this.onMove(1);
      return;
    }

    if (["arrowup", "w", " "].includes(key)) {
      event.preventDefault();
      this.onJump();
    }
  }
}
