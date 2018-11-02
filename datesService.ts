export interface AnalyzedDate {
    isInCurrentMonth: boolean,
    isInFutureMonth: boolean,
    isYesterdayOrEarlier: boolean,
    isTodayOrEarlier: boolean,
    isLastDayOfCurrentMonth: boolean
}

export interface NextMonthResult {
    nextMonth: number;
    nextMonthYear: number;
}

export class DatesService {

    private static datesServiceInstance: DatesService;

    private constructor() { }

    public static getInstance(): DatesService {
        if (!this.datesServiceInstance) {
            this.datesServiceInstance = new DatesService();
        }

        return this.datesServiceInstance;
    }

    public static today(): Date {
        return new Date();
    }

    public static dayOfMonthWithRdThSuffix(args: { forDate: Date }) {

        const ordinal_suffix_of = (i: number) => {
            const j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st";
            }
            if (j == 2 && k != 12) {
                return i + "nd";
            }
            if (j == 3 && k != 13) {
                return i + "rd";
            }
            return i + "th";
        }

        return ordinal_suffix_of(args.forDate.getDate());

    }

    public static dateMonthAsMonthName(args: {forDate: Date, nameFormat: "short" | "long"}) {
        const longMonthNames = 
            ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const shortMonthNames = 
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        return (args.nameFormat === "short" ? shortMonthNames : longMonthNames)[args.forDate.getMonth()];
    }

    private static analyzeDate(args: { forDate: Date }): AnalyzedDate {

        const isInCurrentMOnth = (forDate: Date) => {

            const today = this.today();

            return (
                forDate.getMonth() === today.getMonth() &&
                forDate.getFullYear() === today.getFullYear()
            );

        }

        const isInFutureMonth = (forDate: Date) => {

            const today = this.today();

            return (
                (
                    forDate.getMonth() > today.getMonth() &&
                    forDate.getFullYear() === today.getFullYear()
                )
                ||
                (
                    forDate.getFullYear() > today.getFullYear()
                )
            );

        }

        // this feels overly complicated :(
        const isDateYesterdayOrEarlier = (forDate: Date) => {
            const today = this.today();

            // console.log(`datesService.ts: isDateYesterdayOrEarlier: testing a date:`, forDate);

            // If it's in the future, it's not yesterday or earlier.
            if (args.forDate > today) {
                // console.log(`datesService.ts: isDateYesterdayOrEarlier: date is >= today.`)
                return false;
            }

            // If the target date's year is earlier than today's year, it's yesterday or earlier.
            if (args.forDate.getFullYear() < today.getFullYear()) {
                // console.log(`datesService.ts: isDateYesterdayOrEarlier: test date year < today year.`);
                return true;
            }

            // both dates are in the same year when we get here.
            // If target date's month is < today's month then it's a previous month in the same year.
            if (forDate.getMonth() < today.getMonth()) {
                // console.log(`datesService.ts: isDateYesterdayOrEarlier: test date month < today month.`);
                return true;
            }

            if (forDate.getDate() < today.getDate()) {
                // console.log(`datesService.ts: isDateYesterdayOrEarlier: test date getDate() < today getDate().`);
                return true;
            }

            return false;
        }

        // this feels overly complicated :(
        const isDateTodayOrEarlier = (forDate: Date) => {

            const today = this.today();

            if (args.forDate.getFullYear() === today.getFullYear() &&
                args.forDate.getMonth() === today.getMonth() &&
                args.forDate.getDate() === today.getDate())
            {
                return true;
            }

            if (isDateYesterdayOrEarlier(args.forDate)) {
                return true;
            }

            return false;
        };

        const isLastDayOfCurrentMonth = (dt: Date) => {
            const test = new Date(dt.getTime()),
                month = test.getMonth();
        
            test.setDate(test.getDate() + 1);
            return test.getMonth() !== month;
        };


        const result =  (
            {
                isInCurrentMonth: isInCurrentMOnth(args.forDate),
                isInFutureMonth: isInFutureMonth(args.forDate),
                isYesterdayOrEarlier: isDateYesterdayOrEarlier(args.forDate),
                isTodayOrEarlier: isDateTodayOrEarlier(args.forDate),
                isLastDayOfCurrentMonth: isLastDayOfCurrentMonth(args.forDate)
            }
        );

        // console.log(`datesService.ts: analyzeDate:`, {date: args.forDate, analysis: result});
        return result;
    }

    public static isDateInFutureMonth(args: { forDate: Date }): boolean {
        return this.analyzeDate({ forDate: args.forDate }).isInFutureMonth;
    }

    public static isDateTodayOrEarlier(args: { forDate: Date }): boolean {
        return this.analyzeDate({ forDate: args.forDate }).isTodayOrEarlier;
    }

    public static isDateYesterdayOrEarlier(args: { forDate: Date }): boolean {
        return this.analyzeDate({ forDate: args.forDate }).isYesterdayOrEarlier;
    }

    public static isTodayLastDayOfMonth() {
        return this.analyzeDate({forDate: new Date()}).isLastDayOfCurrentMonth;
    }

    public static isDateInCurrentMonth(args: { forDate: Date }): boolean {

        const dateAnalysis = this.analyzeDate({ forDate: args.forDate });

        return dateAnalysis.isInCurrentMonth;
    }

    public static getNextDaySameTime(args: { forDate: Date }) {

        return args.forDate.setDate(args.forDate.getDate() + 1);
    }

    public static tomorrow() {
        return this.daysOut({ daysInFuture: 1 })
    }

    public static firstLastDayInDate(args: {forDate: Date}) {
        const y = args.forDate.getFullYear(), m = args.forDate.getMonth();
        const firstDay = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0);

        return {
            firstDay: firstDay,
            lastDay: lastDay
        };

    }

    public static lastDateCurrentMonth() {
        return this.firstLastDayInDate({forDate: this.today()}).lastDay;
    }

    public static daysOut(args: { daysInFuture: number }) {
        const futureDate = new Date();
        futureDate.setDate(this.today().getDate() + args.daysInFuture);
        futureDate.setHours(0);
        futureDate.setMinutes(0);

        return futureDate;
    }

    public static daysAgo(args: { daysInPast: number }) {
        const pastDate = new Date();
        pastDate.setDate(this.today().getDay() - args.daysInPast);
        pastDate.setHours(0);
        pastDate.setMinutes(0);

        return pastDate;
    }

    public static nextCalendarMonth(args: { forDate: Date }): NextMonthResult {
        if (args.forDate.getMonth() > 10) {
            return {
                nextMonth: 0,
                nextMonthYear: args.forDate.getFullYear() + 1
            } as NextMonthResult
        }

        return (
            {
                nextMonth: args.forDate.getMonth() + 1,
                nextMonthYear: args.forDate.getFullYear()
            } as NextMonthResult
        );
    }
}
