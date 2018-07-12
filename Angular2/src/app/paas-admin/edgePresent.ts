export class EdgePresent {
    public edgeName: string;
    public operator: string;
    public userId: string;
    public telcoUser: string;
    public description: string;
    public icon: string;
    public iamUsername: string;
    public iamPassword: string;
    public projectID: string;
    public iamUrl: string;
    public location: string;
    public geolocationip: string;
    public latitude: string;
    public longitude: string;
    public resource: Resources = new Resources();
    public usageCharges: UsageCharge = new UsageCharge();
    constructor() { }
}

export class Resources {
    public storage: number;
    public cpu: number;
    public memory: number;
    constructor() { }
}

export class UsageCharge {
    public cpuCharge: number;
    public memoryCharge: number;
    public storageCharge: number;
    constructor() { }
}
