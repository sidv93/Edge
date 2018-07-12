export class Approval {
    public userId: string;
    public approval: string;
    constructor(userId: string, approval: string) {
        this.userId = userId;
        this.approval = approval;
    }
}
