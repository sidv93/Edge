package com.dt.edge.mec.apps.portal.model;

public class AddCredit {
	    public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getNumberOfCredits() {
		return numberOfCredits;
	}
	public void setNumberOfCredits(String numberOfCredits) {
		this.numberOfCredits = numberOfCredits;
	}
	public String getAddOrDelete() {
		return addOrDelete;
	}
	public void setAddOrDelete(String addOrDelete) {
		this.addOrDelete = addOrDelete;
	}   
	
	private String userId;    
	private String numberOfCredits;
	private String addOrDelete;

}
