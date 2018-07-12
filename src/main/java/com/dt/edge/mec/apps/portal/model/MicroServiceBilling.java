package com.dt.edge.mec.apps.portal.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
public class MicroServiceBilling extends BillingPojo{
	private int  creditsPerAPICall;
	private int creditsForDownload;
		
		public int getCreditsPerAPICall() {
		return creditsPerAPICall;
	}
	public void setCreditsPerAPICall(int creditsPerAPICall) {
		this.creditsPerAPICall = creditsPerAPICall;
	}
	public int getCreditsForDownload() {
		return creditsForDownload;
	}
	public void setCreditsForDownload(int creditsForDownload) {
		this.creditsForDownload = creditsForDownload;
	}
	@Override
	public String toString() {
		return "MicroServiceBilling [creditsPerAPICall=" + creditsPerAPICall + ", creditsForDownload="
				+ creditsForDownload + ", getMicroServiceId()=" + getMicroServiceName() + ", getAppName()=" + getApplicationName()
				+ ", getUserID()=" + getUserId() + ", getOnBoardingCharge()=" + getOnBoardingCharge() + "]";
	}
	
	
}
