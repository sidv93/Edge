export class AppUsageDetailsForVmi {
	client_Report : client_Report[] = [];
	constructor(){ }
}

export class client_Report {
	User : string;
	Group : string;
	Login_Count : string;
	Total_Duration : string;
	Session_Details: session_Details[] = [];
	constructor(){ }
}

export class session_Details {
	Duration : string;
	Logout_Time : string;
	Login_Time : string;	
	constructor(){ }
}
