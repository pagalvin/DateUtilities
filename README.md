# DateUtilities
Some utility functions I want to save for the future.

Here's a view into them:

![Snapshot of the Data Utilities Class as of 11/1/18](https://github.com/pagalvin/DateUtilities/blob/master/datesService.JPG "Date Utilities")

```
    public static dayOfMonthWithRdThSuffix(args: { forDate: Date })

    public static dateMonthAsMonthName(args: {forDate: Date, nameFormat: "short" | "long"})

    private static analyzeDate(args: { forDate: Date }): AnalyzedDate

    public static isDateInFutureMonth(args: { forDate: Date }): boolean 

    public static isDateTodayOrEarlier(args: { forDate: Date }): boolean 

    public static isDateYesterdayOrEarlier(args: { forDate: Date }): boolean 

    public static isTodayLastDayOfMonth() 

    public static isDateInCurrentMonth(args: { forDate: Date }): boolean 

    public static getNextDaySameTime(args: { forDate: Date }) 

    public static tomorrow() 

    public static firstLastDayInDate(args: {forDate: Date}) 

    public static lastDateCurrentMonth() 

    public static daysOut(args: { daysInFuture: number }) 

    public static daysAgo(args: { daysInPast: number }) 

    public static nextCalendarMonth(args: { forDate: Date }): NextMonthResult 
```