export class MSRatings {
    public rating : number;
    public feedback : string;
    public timestamp : string;
    public userId : string;
    public microServiceName : string;
    constructor() {}
}

export class IndividualRatings {
  public oneStar : number;
  public twoStar: number;
  public threeStar: number;
  public fourStar: number;
  public fiveStar: number;
  public constructor() { }
}
