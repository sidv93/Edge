export class MSDetailsGraph {
    public userId: string;
    public msUsageData: MSUsageData[] = [];
    constructor() { }
}

export class MSUsageData {
    public microServiceName: string;
    public dataPoints: MSDataPoints[] = [];
    constructor() { }
}

export class MSDataPoints {
    public plotDataPoint: string;
    public msLatency: string;
    public revenue: string;
    public cpuUsage: string;
    public memoryUsage: string;
    constructor() { }
}
