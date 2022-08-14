export enum DateRuEnum {
    "янв.",
    "фев.",
    "мар.",
    "апр.",
    "май",
    "июн.",
    "июл.",
    "авг.",
    "сен.",
    "окт.",
    "ноя.",
    "дек."
};

export enum DateRuEnumNamed {
    "January" = "янв.",
    "February" = "фев.",
    "March" = "мар.",
    "April" = "апр.",
    "May" = "май",
    "June" = "июн.",
    "July" = "июл.",
    "August" = "авг.",
    "September" = "сен.",
    "October" = "окт.",
    "November" = "ноя.",
    "December" = "дек."
};


export interface ParsedTime {
    days: number
    hours: number
    minutes: number
    seconds: number
    milliseconds: number
}

export class DateTime {
    constructor (private readonly date: Date | number) {
    }
    
    static toRuDate(): string;
    static toRuDate(date: Date): string;
    static toRuDate(date?: Date): string {
        let d = date || new Date();
        return `${d.getDate()} ${DateRuEnum[d.getMonth()]} ${d.getFullYear()} г.`;
    }

    public toRuDate(): string {
        let d = typeof this.date === "number" ? new Date(this.date) : this.date;
        return `${d.getDate()} ${DateRuEnum[d.getMonth()]} ${d.getFullYear()} г.`;
    }

    public parseTime (): ParsedTime;
    public parseTime (from: number | Date): ParsedTime;
    public parseTime (from?: number | Date): ParsedTime {
        let remain = (typeof this.date === "number" ? this.date : this.date.getTime()) - (from ? (typeof from === "number" ? from : from.getTime()) :  Date.now())
        let days = Math.floor(remain / (1000 * 60 * 60 * 24))
        remain = remain % (1000 * 60 * 60 * 24)
      
        let hours = Math.floor(remain / (1000 * 60 * 60))
        remain = remain % (1000 * 60 * 60)
      
        let minutes = Math.floor(remain / (1000 * 60))
        remain = remain % (1000 * 60)
      
        let seconds = Math.floor(remain / (1000))
        remain = remain % (1000)
      
        let milliseconds = remain;
      
        return {
          days,
          hours,
          minutes,
          seconds,
          milliseconds
        };
    }

    public formatTime(): string;
    public formatTime(useMilli: boolean): string;
    public formatTime(useMilli?: boolean): string {
        const o = this.parseTime();
        let parts = []
        if (o.days) {
          let ret = o.days + 'д'
          if (o.days !== 1) {
          }
          parts.push(ret)
        }
        if (o.hours) {
          let ret = o.hours + 'ч'
          if (o.hours !== 1) {
          }
          parts.push(ret)
        }
        if (o.minutes) {
          let ret = o.minutes + 'м'
          if (o.minutes !== 1) {
          }
          parts.push(ret)
      
        }
        if (o.seconds) {
          let ret = o.seconds + 'с'
          if (o.seconds !== 1) {
          }
          parts.push(ret)
        }
        if (useMilli && o.milliseconds) {
          let ret = o.milliseconds + 'мс'
          if (o.milliseconds !== 1) {
          }
          parts.push(ret)
        }
        if (parts.length === 0) {
          return 'мгновенно'
        } else {
          return parts.join(' ')
        }
      }

      toString() {
        return this.formatTime()
      }

      /**
       * get time string like 
       * @param remain milliseconds 50000 - 50 seconds
       */
      public static toStringWithZero (remain: number): string {
        let hours = (Math.floor(remain / (1000 * 60 * 60))).toString()
        remain = remain % (1000 * 60 * 60)

        let minutes = (Math.floor(remain / (1000 * 60))).toString()
        remain = remain % (1000 * 60)

        let seconds = (Math.floor(remain / (1000))).toString()
        return `${hours.length === 1 ? "0"+hours : hours}:${minutes.length === 1 ? "0"+minutes : minutes}:${seconds.length === 1 ? "0"+seconds : seconds}`
      }
    
} 
