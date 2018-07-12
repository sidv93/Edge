import {Api, EndPoints, Events, External,
    MetaData, Network, Resources, Source, Workloads} from "./microServiceMetadata";
export class MobileAppMetadata {
    public applicationName: string;
    public userId: string;
    public icon: string;
    public regions: string[];
    public rating: string;
    public owner: string;
    public description: string;
    public documentation: string;
    public onBoardStatus: string = "Pending";
    public enable: boolean = true;
    public contextPath: string;
    public stage: string = "Build";
    public lowLatency: string = "Y";
    public appAtCloudUrl: string;
    public category: string = "Finance";
    public endpoints : string;
    public metadata = new metaDataMobileApp();

}

export class Name {
    public microServiceName: string;
}

export class metaDataMobileApp {
    public appMetadata = new appMetaData();
    public microserviceMetadata: MicroserviceMetadata[] = [];
}

export class appMetaData {
    public applicationType: string;
   //  EdgeCR changes
    public deliveryMethod : string = "vm";
    public microservices: Microservices[] = [];

}
export class Microservices {
    public microServiceName: string;
    public resources: ExposedResources[] = [];
    public useAsLib: string;
    public subscribed: string;
    public exposed = new exposed();
}
export class ExposedResources {
    public name: string;
    public workloadName: string;
}
export class exposed {
    public networks: ExposedClass[] = [];
    public events: ExposedClass[] = [];
    public httpApis: ExposedClass[] = [];
}
export class MicroserviceMetadata {
    public microServiceName: string;
    public tenancy: string = "single";
    // EdgeCR changes
    public deliveryMethod: string;
    // 	external=new External();
    public metadata = new MetaData();
    constructor() { }
}
export class ExposedClass {
    public name: string;
    public exposedTo: string[] = [];
}
export class MicroSericeTempData {
    public microserviceName: string;
    public arrayOfnetworks: ExposedClass[] = [];
    public arrayOfevents: ExposedClass[] = [];
    public arrayOfhttpApis: ExposedClass[] = [];
    public resources: ExposedResources[] = [];
}
