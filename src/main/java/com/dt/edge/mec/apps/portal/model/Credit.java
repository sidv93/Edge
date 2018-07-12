package com.dt.edge.mec.apps.portal.model;

import org.springframework.stereotype.Component;

@Component
public class Credit {
	//@Value("${defaultCredit}")
	private String credit;
	
	@Override
	public String toString() {
		return "Credit [credit=" + credit + ", Userid=" + Userid + "]";
	}

	public String getCredit() {
		return credit;
	}

	public void setCredit(String credit) {
		this.credit = credit;
	}

	private String Userid;

	public String getUserid() {
		return Userid;
	}

	public void setUserid(String userid) {
		Userid = userid;
	}
	

}
