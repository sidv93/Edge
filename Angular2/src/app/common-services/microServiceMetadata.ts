export class MicroServiceMetadata {
    public microServiceName: string;
    public userId: string;
    public icon: string;
    public rating: number;
    public category: string = "Finance";
    public enable: boolean = true;
    public lowLatency: string;
    public regions: any[];
    public description: string;
    public contextPath: string;
    public documentation: string;
    public owner: string;
    public creditsPerAPICall: string;
    public creditsForDownload: string;
    public onBoardStatus: string = "Pending";
    public downloadable: boolean = false;
    public downloadURL: string;
    public stage: string = "Build";
    public appType: string;
    public releaseDate: string;
    public microServiceType: string;
    public metadata = new MetaData();
    public tenancy: string = "single";
    //  EdgeCR changes
    public deliveryMethod: string = "vm";
    public endpoints : string;
    constructor() { }
}

export class MetaData {

    public external = new External();
    public workloads: Workloads[] = [];
    constructor() { }
}

export class External {
    public events: string[] = [];
    public networks: string[] = [];
    public httpApis: string[] = [];
}

export class Workloads {
    public tenancy: string;
    public workloadName: string;
    // EdgeCR changes
    public deliveryMethod : string;
    public source = new Source();
    public events: Events[] = [];
    public httpApis = new Api();
    public networks = new Array<Network>();
    public resources = new Array<Resources>();
}

export class Source {
    public username: string;
    public password: string;
    public sourceRepo: string = "Select Source Repository";
    public path: string;
    public serviceType: string;
    constructor() {
        // this.external = false;
    }
}

export class Events {
    public name: string;
    public fn: string;
    public external: boolean;
    constructor() {
        // this.external = false;
    }
}

export class Api {
    public port: string;
    public endpoints = new Array<EndPoints>();
}

export class EndPoints {
    public name: string;
    public fn: string;
    public external: boolean;
    constructor() {
        // this.external = false;
    }
}

export class Network {
    public name: string;
    public port: string;
    public protocol: string = "tcp";
    public external: boolean;
    constructor() {
        // this.external = false;
    }
}

export class Resources {
    public name: string;
    public cpu: string;
    public memory: string;
    public storage: string;
    public bandwidth: string;
}
export class Temp {
    public tenancy: string;
    public workloadName: string = "";
    public port: string;
    public microserviceName: string;
}
