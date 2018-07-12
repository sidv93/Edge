export class CloudLetOnBoard {

    public operator: string;
    public edgeName: string;
    public cloudletName: string;
    public regions = new Regions();
    public policyFile: string;
    public policyFileName: string;
    public description: string;
    public icon: string;
    public onBoardStatus: string = "Pending";
    public failureReason: string;
    public environment: string;
    public heatTemplate: string;
    public heatTemplateName: string;
    public vmiEnabled: string="N";
    public usageCharges = new UsageCharges();
}

export class UsageCharges {
    public computeCharge: string;
    public resourceCharge: string;
    public storageCharge: string;
}

export class Regions {
  public lowLatency:string[]=[];
  public all:string[]=[];
}
