export class MSDashboard {
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
    public latency: string;
    constructor() { }
}
export class CPUUsage {
    public usage: string;
    constructor() { }
}
export class UsersPerDay {
    public usersPerDay: string;
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
export class Usage {
    public usage: string;
    constructor() { }
}

export class Session {
    public usage: string;
    constructor() { }
}
