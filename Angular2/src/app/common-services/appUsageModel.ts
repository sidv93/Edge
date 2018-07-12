export class AppDetailsGraph {
    public userId: string;
    public appUsageData: UsageData[] = [];
    constructor() { }
}

export class UsageData {
    public applicationName: string;
    public dataPoints: DataPoints[] = [];
    constructor() { }
}

export class DataPoints {
    public plotDataPoint: string;
    public appLatency: string;
    public sessionLength: string;
    public cpuUsage: string;
    public memoryUsage: string;
    constructor() { }
}
