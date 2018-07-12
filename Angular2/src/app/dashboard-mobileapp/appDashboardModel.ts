export class AppDashboard {
    public topEntities: TopEntity[] = [];
    public dataMappings: DataMappings[] = [];
    constructor() { }
}

export class TopEntity {
    public name: string;
    public metricValue: number;
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

export class Latency {
    public usage: number;
    constructor() { }
}
export class CPUUsage {
    public usage: number;
    constructor() { }
}
export class UsersPerDay {
    public usage: number;
    constructor() { }
}
export class Credits {
    public creditsAvailable: number;
    constructor() { }
}
export class Subscription {
    public totalSubscriptions: string;
    constructor() { }
}
