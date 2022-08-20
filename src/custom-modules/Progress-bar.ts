export class ProgressBar {
    private bar: string = "";
    private total: number
    private current: number
    private size: number = 40
    private line: string = '▬'
    private slider: string = '🔘'
    constructor (options: {total: number, current: number, size?: number, line?: string, slider?: string}) {
        Object.assign(this, options);
    }

    toString () {
        return this.bar;
    }
    
    
    splitBar ()  {
        if (!this.total) throw new Error('Total value is either not provided or invalid');
        if (!this.current && this.current !== 0) throw new Error('Current value is either not provided or invalid');
        if (isNaN(this.total)) throw new Error('Total value is not an integer');
        if (isNaN(this.current)) throw new Error('Current value is not an integer');
        if (isNaN(this.size)) throw new Error('Size is not an integer');
        if (this.current > this.total) {
            this.bar = this.line.repeat(this.size + 2);
            const percentage = (this.current / this.total) * 100;
        } else {
            const percentage = this.current / this.total;
            const progress = Math.round((this.size * percentage));
            const emptyProgress = this.size - progress;
            const progressText = this.line.repeat(progress).replace(/.$/, this.slider);
            const emptyProgressText = this.line.repeat(emptyProgress);
            this.bar = progressText + emptyProgressText;
            const calculated = percentage * 100;
        }
        return this;
    };

    filledBar () {
        if (!this.total) throw new Error('Total value is either not provided or invalid');
        if (!this.current && this.current !== 0) throw new Error('Current value is either not provided or invalid');
        if (isNaN(this.total)) throw new Error('Total value is not an integer');
        if (isNaN(this.current)) throw new Error('Current value is not an integer');
        if (isNaN(this.size)) throw new Error('Size is not an integer');
        if (this.current > this.total) {
            this.bar = this.slider.repeat(this.size + 2);
            const percentage = (this.current / this.total) * 100;
        } else {
            const percentage = this.current / this.total;
            const progress = Math.round((this.size * percentage));
            const emptyProgress = this.size - progress;
            const progressText = this.slider.repeat(progress);
            const emptyProgressText = this.line.repeat(emptyProgress);
            this.bar = progressText + emptyProgressText;
            const calculated = percentage * 100;
        }
        return this;
    }
}