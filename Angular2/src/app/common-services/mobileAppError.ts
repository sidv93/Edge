export class MobileAppError {
    public applicationName: string;
    public onBoardStatus: string;
    public metadata = new metaDataMobileApp();
    constructor() { }
}

export class metaDataMobileApp {
    public microserviceMetadata: MicroserviceMetadata[] = [];
    constructor() { }
}


export class MicroserviceMetadata {
    public microServiceName: string = "";
    public metadata = new MetaData();
    constructor() { }
}

export class MetaData {
    public workloads: Workloads[] = [];
    constructor() { }
}

export class Workloads {
    public status: string;
    public workloadName: string;
    public jobID: string;
    public bugID: string;
    public artifactURL: string;
    public logURL: string;
    public dockerImageTag: string;
    public buildStartTime: string;
    public buildEndTime: string;
    constructor() { }
}
