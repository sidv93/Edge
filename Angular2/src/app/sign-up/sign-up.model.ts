/*export class SignUp {
  constructor(
    public firstName:string,
    public lastName:string,
    public emailId:string,
    public username:string,
    public password: string,
    public retypePassword:string,
    public country:string,
    public state:string,
    public companyName:string,
    public signingUpFor:string,
  ){}
}*/

export class SignUp {
    public firstName: string;
    public lastName: string;
    public emailId: string;
    public userId: string;
    public password: string;
    public retypePassword: string;
    public country: string;
    public state: string;
    public companyName: string;
    public signingUpFor: string[];
    public termsnconditons: Boolean;
    public telcoLogo: string;
    public signString: string;
    constructor() { }
}
