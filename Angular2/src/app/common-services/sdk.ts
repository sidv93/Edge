export class SDK {
    public language: string = "";
    public sdks: InnerSDK[] = [];
    constructor() {}
}

export class InnerSDK {
    public sdkLanguage: string;
    public sdkVersion: string;
    public sdkName: string;
    public releaseDate: string;
    public sdkDescription: string;
    public identifier: string;
    public size: string;
    constructor() {}
}

export class VersionCheck {
    public version: number;
    public index: number;
    public langIndex: number;
    constructor() { }
}
