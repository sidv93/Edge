package com.dt.edge.mec.apps.portal.requesthandler;

import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.dt.edge.mec.apps.portal.authorization.IAMTokenManager;
import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.model.AddCredit;
import com.dt.edge.mec.apps.portal.model.LoginData;
import com.dt.edge.mec.apps.portal.model.LoginModel;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.model.SignUpModel;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;
import com.dt.edge.mec.apps.portal.utility.ValidateJsonData;
import com.dt.edge.mec.iam.proxy.UserState;

@Component("IAMRequestHandler")
public class IAMRequestHandler {

	/** assign value from property file */
	@Autowired
	@Qualifier("loginvalidator")
	private ValidateJsonData jsonValidator;
	@Autowired
	ErrorCodes errCodes;
	@Value("${MEC.creditValue}")
	private String creditValue;
	@Autowired
	@Qualifier("signupvalidator")
	private ValidateJsonData jsonSignUpValidator;
	@Autowired
	private ClientErrorHandler clientErrorHandler;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	private String usagemodulebaseuri;
	private String billingModuleAddOrDeleteCreditsURI;
	@Value("#{${MEC.BILLINGURIMAP}}")
	private Map<String, String> BILLINGURIMAP;
	private String usageModuleName;
	@Value("${MEC.SessionTimeout}")
	private int sessionTimeout;
	@Autowired
	private GetBaseUrl baseUrl;
	private final Logger logger = LogManager.getLogger(IAMRequestHandler.class.getName());

	@PostConstruct
	private void init() {
		usageModuleName = moduleNameMap.get("USAGEMODULE");
		usagemodulebaseuri = baseUrl.getBaseUri(usageModuleName);
		logger.info("usagemodulename" + usagemodulebaseuri);
		billingModuleAddOrDeleteCreditsURI = BILLINGURIMAP.get("billingModuleAddOrDeleteCreditsURI");
		logger.info("IAM" + usagemodulebaseuri + usageModuleName + billingModuleAddOrDeleteCreditsURI);
	}

	public ResponseEntity<?> handleloginRequest(Object requestData) throws Exception {
		LoginModel response = new LoginModel();
		UserState userState = null;
		logger.info("<<<< enter LoginRequestHandler - handleRequest >>>>");
		LoginData request = (LoginData) requestData;
		logger.info("Got request to handle login :" + request.toString());
		Map<String, String> errorMap = null;
		errorMap = jsonValidator.getError(request.getLoginModel());
		if (Integer.parseInt((String) (errorMap.get("ERRORNO"))) > 0) {
			logger.info("Error in validation ");
			throw new MECException(errorMap.get("ERRORMSG"), "Validation Failure", PortalConstants.FAILURE_STRING, HttpStatus.BAD_REQUEST);
		}
		userState = IAMTokenManager.getIamproxy().loginUser(request.getLoginModel().getUsername(),
				request.getLoginModel().getPassword());
		if (userState.getErrorMessage() != null) {
			logger.info("error");
			throw new MECException(userState.getErrorMessage(), "400", PortalConstants.FAILURE_STRING, HttpStatus.BAD_REQUEST);
		}
		System.out.println("Token:" + userState.getAccessToken() + " Expires :" + userState.getExpiresIn());
		logger.info(userState);
		logger.info("<<<< exit LoginRequestHandler - handleRequest >>>>");
		if (userState.getUserId() == null && userState.getUserType() == null) {
			logger.info("got null values");
			throw new MECException("Unable to login", "400", "Failure", HttpStatus.BAD_REQUEST);
		} else {
			response.setUserType(userState.getUserType());
			response.setId(userState.getUserId());
			response.setCompanyName(userState.getCompanyName());
			response.setSessionTimeout(sessionTimeout);
			response.setAccessToken(userState.getAccessToken());
		}

		/*
		 * LoginModel response=new LoginModel(); List <String> userType=new
		 * ArrayList<String>(); response.setUserType(userType);
		 * response.getUserType().add("MobileAppsDeveloper");
		 * response.getUserType().add("MicroServiceDeveloper");
		 * response.setId("123"); response.setCompanyName("aricent");
		 */

		return new ResponseEntity<LoginModel>(response, HttpStatus.ACCEPTED);
	}

	public ResponseEntity<?> handleSignUpRequest(Object requestData) throws Exception {
		String creditSignupValue = creditValue;
		boolean telcoserFlag = false;
		boolean signUpFlag = false;
		logger.info("<<<< enter SignUpRequestHandler - handleRequest >>>>");
		AddCredit credit = null;
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		SignUpModel request = (SignUpModel) requestData;
		logger.info("got request for sign up:" + requestData);
		Map<String, String> errorMap = null;
		ResponseEntity<String> responseEntityCredit = null;
		RestTemplate restTemplateCredit = new RestTemplate();
		errorMap = jsonSignUpValidator.getError(request);
		if (request.getSigningUpFor().contains("TelcoDeveloper")) {
			telcoserFlag = true;
			creditSignupValue = "0";
			logger.info("telco user registration");

		}
		if (Integer.parseInt((String) (errorMap.get("ERRORNO"))) > 0) {
			throw new MECException(errorMap.get("ERRORMSG"), "400", PortalConstants.FAILURE_STRING, HttpStatus.BAD_REQUEST);
		}
		/*List<String> userType = new ArrayList<>();
		userType = request.getSigningUpFor();
		logger.info(request.getSigningUpFor());*/
		// request.getSigningUpFor();
		JSONObject signupResponse = IAMTokenManager.getIamproxy().registerUser(request.getFirstName(),
				request.getLastName(), "", request.getUsername(), request.getPassword(), request.getEmailId(), "", "",
				request.getCompanyName(), request.getCountry(), request.getState(), request.getSigningUpFor(), Integer.parseInt("0"), "",
				"", "", "", "");
		logger.info("User Response :" + signupResponse);
		if (signupResponse.containsKey("status")) {
			if (signupResponse.get("status").equals("201")) {
				logger.info("signupsuccess");
				signUpFlag = true;
			}
		}
		logger.info(signupResponse);
		if (signupResponse.containsKey("message")) {
			throw new MECException((String) signupResponse.get("message"), "400",PortalConstants.FAILURE_STRING, HttpStatus.BAD_REQUEST);
		}
		if (signUpFlag) {
			if (!telcoserFlag) {
				credit = new AddCredit();
				credit.setAddOrDelete("add");
				credit.setNumberOfCredits(creditSignupValue);
				credit.setUserId(request.getUsername());
				try {
					HttpEntity<AddCredit> creditEntity = new HttpEntity<AddCredit>(credit, headers);
					logger.info("URL triggerd for signup billing flow:" + usagemodulebaseuri
							+ billingModuleAddOrDeleteCreditsURI);
					responseEntityCredit = restTemplateCredit.exchange(
							usagemodulebaseuri + billingModuleAddOrDeleteCreditsURI, HttpMethod.POST, creditEntity,
							String.class);
					clientErrorHandler.handleClientEror(responseEntityCredit, errCodes.getIamErrorStatus());
					logger.info("Response status from billing:" + responseEntityCredit.getStatusCodeValue());
					logger.info("Response message from billing" + responseEntityCredit.getBody().toString());
				} catch (Exception e) {

					logger.info("Caught Exception " + e.getMessage());
					throw new MECException("400", "Fail to Add Credits", PortalConstants.FAILURE_STRING, HttpStatus.FAILED_DEPENDENCY);

				}
			} else {
				logger.info("telco user no need to add credits");
			}
		}
		logger.info("<<<< exit SignUpRequestHandler - handleRequest >>>>");
		if (signUpFlag)
			return new ResponseEntity<>(new ResponseMessage("201", "SignUpsuccess", "success"), HttpStatus.OK);
		else
			return new ResponseEntity<>(new ResponseMessage("400", "Fail to SignUp", "failure"), HttpStatus.OK);
	}

}
