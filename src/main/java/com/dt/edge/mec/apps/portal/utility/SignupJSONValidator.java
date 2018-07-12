package com.dt.edge.mec.apps.portal.utility;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dt.edge.mec.apps.portal.model.SignUpModel;

@Component("signupvalidator")
public class SignupJSONValidator implements ValidateJsonData {

	@Value("${MEC.PasswordRegex}")
	private String PASSWORDREGEX;
	@Value("${MEC.EmailRegex}")
	private String EMAILREGEX;
	private final Logger logger = LogManager.getLogger(SignupJSONValidator.class.getName());

	public Map<String, String> getError(Object j) {
		logger.info("<<<< SignupJSONValidator - getError >>>>");
		SignUpModel signUpModel = (SignUpModel) j;
		Map<String, String> errorMap = new HashMap<String, String>();
		String password = null;
		int noErrors = 0;
		String errorMsg = "";

		try {
			if (signUpModel.getFirstName() == null ) {
				noErrors++;
				errorMsg += " First Name validation Fail";
			}
			if (signUpModel.getLastName() == null ) {
				noErrors++;
				errorMsg += " Last Name validation Fail";
			}

			if (signUpModel.getEmailId() == null) {
				noErrors++;
				errorMsg += " emailid field is empty";
			} else {
				if (!matchPattern(signUpModel.getEmailId(), EMAILREGEX)) {
					noErrors++;
					errorMsg += " email is not valid";
				}
			}
			if (signUpModel.getPassword() == null) {
				noErrors++;
				errorMsg += " JSon Doesnot contain password";
			} else {
				if (!matchPattern(signUpModel.getPassword(), PASSWORDREGEX)) {
					noErrors++;
					errorMsg += " password is not valid";
				} else {
					password = signUpModel.getPassword();
				}
			}
			if (signUpModel.getRetypePassword() == null) {
				noErrors++;
				errorMsg += " JSon Doesnot contain retypepassword";
			} else {
				System.out.println(password+ " "+signUpModel.getRetypePassword());
				if (password != null) {
					System.out.println(!(password.equals(signUpModel.getRetypePassword())));
					if (!(password.equals(signUpModel.getRetypePassword()))) {
						System.out.println("hello");
						noErrors++;
						errorMsg += " retypepassword is not equal to password";
					}
				}
			}
			if (signUpModel.getCompanyName() == null) {
				noErrors++;
				errorMsg += " JSon Doesnot contain compayName";
			}
			if (signUpModel.getSigningUpFor() == null) {
				noErrors++;
				errorMsg += " JSon Doesnot contain Role";
			}

		} catch (Exception e) {
			logger.debug("Failed to validate Json " );
			errorMsg += " JSON validation failed";
			noErrors++;
		}
		logger.debug("No of Error" + noErrors + "Error Message" + errorMsg + "In Json");
		System.out.println(errorMsg);
		errorMap.put("ERRORNO", String.valueOf(noErrors));
		errorMap.put("ERRORMSG", errorMsg);
		return errorMap;
	}

	public boolean matchPattern(String line, String pattern) {
		Pattern r = Pattern.compile(pattern);
		Matcher m = r.matcher(line);
		if (m.find()) {
			return true;
		} else {
			return false;
		}
	}
}
