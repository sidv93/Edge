export class CreditsConsumed {
    public userId: string;
    public monthly: Period[] = [];
    public totalCreditsConsumed: number;
    constructor() { }
}

export class Period {
    public applicationName: string;
    public onBoardCharges: string;
    public infraCharges: string;
    public regionCharges: string;
    public slaCharges: string;
    public apiUsageCharges: string;
    public creditsConsumed: number;
    constructor() { }
}

export class CreditsEarned {
    public userId: string;
    public monthly: PeriodMS[] = [];
    public totalCreditsEarned: number;
    constructor() { }
}

export class PeriodMS {
    public microServiceName: string;
    public onBoardCharges: string;
    public infraCharges: string;
    public regionCharges: string;
    public slaCharges: string;
    public apiUsageCharges: string;
    public creditsEarned: number;
    constructor() { }
}

export class TelcoBilling {
    public telcoUser: string;
    public monthly: MonthlyTelco[] = [];
    public totalCreditsEarned: number;
    constructor() { }
}

export class MonthlyTelco {
    public edgeName: string;
    public cpuCharges: string;
    public storageCharges: string;
    public memoryCharges: string;
    public regionCharges: string;
    public slaCharges: string;
    public creditsEarned: number;
    constructor() { }
}

export class NewcoBilling {
    public userId: string;
    public monthly: MonthlyNewco[] = [];
    public totalCreditsEarned: number;
    constructor() { }
}

export class MonthlyNewco {
    public edgeName: string;
    public cloudletName: string;
    public usageRevenue: string;
    public telcoCharges: string;
    public netRevenue: string;
}
