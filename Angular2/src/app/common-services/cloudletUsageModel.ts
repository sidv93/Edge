export class CloudletGraph {
    public operatorId: string;
    public paasUsageData: UsageData[] = [];
    constructor() { }
}

export class UsageData {
    public cloudletName: string;
    public clLatency: string;
    public gpuUsage: string;
    public cpuUsage: string;
    public memoryUsage: string;
    public storage: string;
    constructor() { }
}

export class TelcoUsage {
    public telcoUser: string;
    public telcoUsageData: TelcoUsageData[] = [];
    constructor() { }
}

export class TelcoUsageData {
    public edgeName: string;
    public clLatency: string;
    public gpuUsage: string;
    public cpuUsage: string;
    public memoryUsage: string;
    public storage: string;
    constructor() { }
}