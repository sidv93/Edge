package com.dt.edge.mec.apps.portal.model;

import org.springframework.stereotype.Component;

@Component
public class MicroServicesName {
	
	private String microServiceName;

	public String getMicroServiceName() {
		return microServiceName;
	}

	public void setMicroServiceName(String microServiceName) {
		this.microServiceName = microServiceName;
	}
	

}
