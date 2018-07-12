
export class Credits {
    public creditsAvailable: number;
    constructor() { }
}

export class CloudletUsage {
    public cpuUsage: number;
    public memoryUsage: number;
    public storageUsage: number;
    constructor() { }
}

export class CloudletDashboard {
    public dataMappings: DataMappings[] = [];
    constructor() { }
}
export class DataMappings {
    public name: string;
    public dataPoints: DataPoints[] = [];
    constructor() { }
}

export class DataPoints {
    public dateAndTime: string;
    public metric: string;
    constructor() { }
}
