class BarVisualizer {
    constructor(audioCtx, audioElement, canvasElement, config = {}) {
        this.config = config;

        this.src = audioCtx.createMediaElementSource(audioElement);
        this.analyzer = audioCtx.createAnalyser();

        this.analyzer.minDecibels = this.config.minDecibels || -120;
        this.analyzer.maxDecibels = this.config.maxDecibels || -30;

        this.src.connect(this.analyzer);
        this.analyzer.connect(audioCtx.destination);

        this.context = canvasElement.getContext('2d');
        this.height = canvasElement.height;
        this.width = canvasElement.width;

        this.frequencyValues = new Uint8Array(this.analyzer.frequencyBinCount);
    }

    draw() {
        requestAnimationFrame(() => this.draw());
        this.analyzer.getByteFrequencyData(this.frequencyValues);

        const barWidth = this.width / this.analyzer.frequencyBinCount;

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.beginPath();

        if (this.config.mirror) {
            for (let i = 0; i < this.frequencyValues.length; i++) {
                this.context.quadraticCurveTo(
                    (i + 0.5) * barWidth,
                    (1 - this.frequencyValues[i] / 256) * this.height / 2,
                    i * barWidth,
                    (1 - this.frequencyValues[i] / 256) * this.height / 2
                );
            }
            for (let i = this.frequencyValues.length - 1; i >= 0; i--) {
                this.context.quadraticCurveTo(
                    (i + 0.5) * barWidth,
                    (this.frequencyValues[i] / 256) * this.height / 2 + this.height / 2,
                    i * barWidth,
                    (this.frequencyValues[i] / 256) * this.height / 2 + this.height / 2
                );
            }
        } else {
            for (let i = 0; i < this.frequencyValues.length; i++) {
                this.context.quadraticCurveTo(
                    (i + 0.5) * barWidth,
                    (1 - this.frequencyValues[i] / 256) * this.height,
                    i * barWidth,
                    (1 - this.frequencyValues[i] / 256) * this.height
                );
            }
        }

        if (this.config.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }
}