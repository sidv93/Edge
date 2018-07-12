package com.dt.edge.mec.apps.portal.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
public class UpdateBillingRates {
	private String userId;
	private String microServiceName;
	private int  creditsPerAPICall;
	private int creditsForDownload;
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getMicroServiceName() {
		return microServiceName;
	}
	public void setMicroServiceName(String microServiceName) {
		this.microServiceName = microServiceName;
	}
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
	
	
}
