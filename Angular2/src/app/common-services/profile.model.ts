export class Profile {
    public userId: string;
    public firstName: string;
    public lastName: string;
    public profilePic: string;
    public credits: number;
    // Personal Information
    public password: string;
    public email: string;
    public contactNumber: string;
    public address: string;
    public companyName: string;
    public country: string;
    public state: string;
    public userType: string[];
    public location: string;
    public cardInfo = new CardDetails();
    constructor() { }

}

export class CardDetails {
    // Saved card details
    public cardType: string;
    public cardNumber: string;
    public cardHolderName: string;
    public cardExpiryDate: string;
    public expiryMonth: string;
    public expiryYear: string;
    constructor() { }

}

export class PeopleInCircle {
    // People from your circle
    public name: string;
    public picture: string;
    public state: string;
    public country: string;
    constructor() { }

}

export class Credits {
    public userId: string;
    public numberOfCredits: number;
    public addOrDelete: string;
    constructor() { }

}
