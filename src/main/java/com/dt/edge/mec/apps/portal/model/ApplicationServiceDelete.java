package com.dt.edge.mec.apps.portal.model;

public class ApplicationServiceDelete {
	private String applicationName;
	  private String onBoardStatus;
	  private boolean enable;
	  public boolean isEnabled() {
	      return enable;
	  }
	  public void setEnable(boolean enable) {
	      this.enable = enable;
	  }
    public String getApplicationName() {
		return applicationName;
	}
	public void setApplicationName(String applicationName) {
		this.applicationName = applicationName;
	}
	public String getOnBoardStatus() {
		return onBoardStatus;
	}
	public void setOnBoardStatus(String onBoardStatus) {
		this.onBoardStatus = onBoardStatus;
	}
	  
}
