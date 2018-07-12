package com.dt.edge.mec.apps.portal.utility;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dt.edge.mec.apps.portal.model.LoginModel;

@Component("loginvalidator")
public class LoginJSONValidator implements ValidateJsonData {
	@Value("${MEC.PasswordRegex}")
	private  String PASSWORDREGEX;
	private final Logger logger = LogManager.getLogger(LoginJSONValidator.class.getName());
	public Map<String, String> getError(Object j) {
		logger.info("<<<< LoginJSONValidator - getError >>>>");
		LoginModel loginModel=(LoginModel)j;
		Map<String,String> errorMap=new HashMap<String,String>();
		int noErrors=0;
		String errorMsg="";
		try{
	 	if(loginModel.getUsername()==null)
	 	{
	 		noErrors++;
			errorMsg+=" Username cannot be null";
	 	}
		if(loginModel.getPassword()==null){
			noErrors++;
			errorMsg+=" Password cannot be null";
		}
	/*	else{
				if(!matchPattern(loginModel.getPassword(), PASSWORDREGEX)){
					noErrors++;
					errorMsg+=" password is not valid";
				}
				
		}*/
	
		}
		catch(Exception e){
			logger.debug("Failed to validate Json + ");
			errorMsg+=" JSON validation failed";
			noErrors++;
		}

		logger.debug("No of Error"+noErrors+"Error Message"+errorMsg+"In Json");
		errorMap.put("ERRORNO",String.valueOf(noErrors));
		errorMap.put("ERRORMSG",errorMsg);
		return errorMap;
	}
public boolean matchPattern(String line,String pattern){
    Pattern r = Pattern.compile(pattern);
    Matcher m = r.matcher(line);
    if (m.find( )) {   	
      return true;
    }else {
    	return false;
    }
 }
}


