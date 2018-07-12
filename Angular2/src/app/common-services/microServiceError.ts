export class MicroServiceError {
    public microServiceName: string;
    public metadata = new MetaDataMicroService();
    constructor() { }
}

export class MetaDataMicroService {
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
