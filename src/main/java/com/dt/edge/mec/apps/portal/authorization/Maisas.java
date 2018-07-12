package com.dt.edge.mec.apps.portal.authorization;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;

import com.dt.edge.mec.iam.proxy.IAMproxy;

public class Maisas{
	public static void main(String args[]){
	IAMproxy ip = new IAMproxy("172.19.74.216",8080);
	//	IAMproxy ip = new IAMproxy("localhost",8080);
		List<String> userTypeList = new ArrayList<String>();

		userTypeList.add("App Developer");
		userTypeList.add("MS Developer");
		userTypeList.add("Administrator");

		System.out.println("****************User registration*******************");
		JSONObject regJsonObject = ip.registerUser("first", "last", "profilePic", "Developer22","Admin@1234",
				"email", "1234567890", "address", "companyName", "country", "state",
				userTypeList, 150, "cardType", "1234", "cardHolderName","2017-03-15", "operatorLogo");
		System.out.println("User Register response : " + regJsonObject); 
	}
}
