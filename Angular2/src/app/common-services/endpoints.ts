export class Endpoints {
  public microservices :Microservice[] = [];
  public deploymentId = new DeploymentId();
  constructor() { }
}

export class Microservice {
  public name : string;
  public uuid : string;
  public networkBinding : NetworkBinding[] = [];
  public httpGateway : HttpGateway[] = [];
  public eventGateway : EventGateway[] = [];
}

export class NetworkBinding {
  public networkId : string;
  public endpoint : string;
}

export class HttpGateway {
  public expiresIn : string;
  public endpoint : string;
  public refreshToken : string;
  public accessToken : string;
  public httpApiId : string;
}

export class EventGateway {
  public eventId : string;
  public endpoint : string;
}

export class DeploymentId {
  public cloudletId : string;
  public uuid : string;
  public developerId : string;
  public appId : string;
}
