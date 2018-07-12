package com.dt.edge.mec.apps.portal.helper;

import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.model.UserProfile;
import com.dt.edge.mec.apps.portal.model.UserProfileResponseToAngular;
import com.dt.edge.mec.apps.portal.requesthandler.BillingRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.CentralReopositoryRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.DevOPsRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.UserProfileRequestHandler;
import com.dt.edge.mec.apps.portal.utility.OnBoardUtils;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@Component
// need to rename it as OnBoardRequestHelper
public class OnBoardRequestHelper {
	@Value("${MEC.creditValue}")
	private String credit;
	@Autowired
	private DevOPsRequestHandler devOPsRequestHandler;
	@Autowired
	private CentralReopositoryRequestHandler centralReopositoryRequestHandler;
	@Autowired
	private BillingRequestHandler billingRequestHandler;
	@Autowired
	private OnBoardUtils onBoardUtils;
	@Autowired
	private UserProfileRequestHandler userprofileHandler;

	private final Logger logger = LogManager.getLogger(OnBoardRequestHelper.class.getName());
	private final String MICROSERVICENAME = "microServiceName";
	private final String APPLICATIONNAME = "applicationName";

	/**
	 * 
	 * @param userId
	 * @return
	 * @throws MECException
	 */
	public ResponseEntity<?> isSufficientCreditAvailable(String userId) throws MECException {
		logger.info("<<<< exit OnBoardRequestHandler - isSufficientCreditAvailable >>>>");
		logger.info("User ID and Credit for Validation" + "userId=" + userId + "with deafult Credit=" + credit);
		/*
		 * Calling getProfile(uid) from Central repository . It will return
		 * user/Developer profile
		 */
		UserProfileResponseToAngular userProfileResponseToAngular = new UserProfileResponseToAngular();
		UserProfile userfile = userprofileHandler.getUserProfile(userId, credit);

		logger.info("User Profile is " + userfile);
		if (userfile.getCredits() == null || userfile.getCredits().isEmpty()) {
			throw new MECException("users credit", "users credit is null", "Failure", HttpStatus.BAD_REQUEST);
		}
		userProfileResponseToAngular.setAvialableCredits(Integer.parseInt(userfile.getCredits()));
		userProfileResponseToAngular.setOnboardingCharge(Integer.parseInt(credit));
		String userProfileResponseToAngularString = onBoardUtils.ObjectToJsonString(userProfileResponseToAngular);
		return new ResponseEntity<>(userProfileResponseToAngularString, HttpStatus.OK);
		/*
		 * if (Integer.parseInt(userfile.getCredits()) >
		 * Integer.parseInt(credit)) {
		 * logger.info("user credit is "+userfile.getCredits()); //String
		 * jasonResponse = "{\"status\":\"success\"}"; return new
		 * ResponseEntity<>(new
		 * ResponseMessage(HttpStatus.OK.toString(),"Credit is valid",
		 * "success"), HttpStatus.OK); } else { //String jasonResponse =
		 * "{\"status\":\"failed\"}"; return new ResponseEntity<>(new
		 * ResponseMessage(HttpStatus.OK.toString(),"Credit is not valid",
		 * "Failed"), HttpStatus.BAD_REQUEST); }
		 */

	}

	private ResponseEntity<?> validateServiceName(String microServices) throws MECException {

		/*
		 * calling method of Central Repository validatename
		 */
		logger.info("Name validation " + microServices);
		ResponseEntity<?> response = centralReopositoryRequestHandler.getServiceName(microServices);
		logger.info("Getting Name  " + response);
		return response;

	}

	private ResponseEntity<?> validateServiceName(String type, String microServices) throws MECException {

		/*
		 * calling method of Central Repository validatename
		 */
		logger.info("Name validation " + microServices);
		ResponseEntity<?> response = centralReopositoryRequestHandler.getServiceName(type, microServices);
		logger.info("Getting Name  " + response);
		return response;

	}

	public ResponseEntity<?> saveMetaData(String Jason, String Method, String url) throws MECException {
		/*
		 * calling central repository to save meta data if save is sucessfull
		 * then
		 * 
		 */
		logger.info("Saving data for ID " + Jason);
		ResponseEntity<?> response = centralReopositoryRequestHandler.saveDataToDB(Jason, Method, url);
		// Exception need to be handle

		logger.info("response of after saving data in repository" + response);

		return response;

	}

	public ResponseEntity<?> forWardToDevops(String jason, String method, String url, String name) throws MECException {
		logger.info("sending request  to DevOps " + jason);
		System.out.println("sending request  to DevOps " + jason);
		return devOPsRequestHandler.sendRequestToDevOps(jason, method, url, name);
		// return sendRequestToDevOps(jason,method);

	}

	public ResponseEntity<?> forwardTobillingSection(String usedCredit, String method) throws MECException {
		logger.info("Forwarding request to billing section " + usedCredit);
		ResponseEntity<?> response = null;
		try {
			response = billingRequestHandler.sendRequestToBilling(usedCredit, method);
		} catch (MECException e) {
			throw new MECException("Server Error", "Server Error", "Failure", HttpStatus.BAD_REQUEST);

		}

		return response;
	}

	private ResponseEntity<?> requestToDeleteSaveMetaData(String microServiceName, String url) throws Exception {
		logger.info("deleting data for microServiceName  " + microServiceName);
		return centralReopositoryRequestHandler.DeleteSaveMetaData(microServiceName, url);
	}

	public ResponseEntity<?> deleteMetadata(Map<String, String> jsonMap, String url) throws Exception {
		ResponseEntity<?> response = null;
		if (jsonMap.get(MICROSERVICENAME) != null && jsonMap.get(MICROSERVICENAME) != "") {
			response = requestToDeleteSaveMetaData(jsonMap.get(MICROSERVICENAME), url);

		} else if (jsonMap.get(APPLICATIONNAME) != null && jsonMap.get(APPLICATIONNAME) != "") {
			response = requestToDeleteSaveMetaData(jsonMap.get(APPLICATIONNAME), url);
		}

		return response;

	}

	public ResponseEntity<?> validate(String type, Map<String, String> httpEntity) throws MECException {
		ResponseEntity<?> response = null;
		if (httpEntity.get(MICROSERVICENAME) != null && !(httpEntity.get(MICROSERVICENAME).isEmpty())) {
			logger.info("Resquest is for microservice and microserviceName is: " + httpEntity.get(MICROSERVICENAME));
			response = validateServiceName(httpEntity.get(MICROSERVICENAME));

		} else if (httpEntity.get(APPLICATIONNAME) != null && !(httpEntity.get(APPLICATIONNAME).isEmpty())) {
			logger.info("Resquest is for Application  and applicationName is: " + httpEntity.get(APPLICATIONNAME));
			response = validateServiceName(httpEntity.get(APPLICATIONNAME));

		} else if (httpEntity.get("edgeName") != null && !(httpEntity.get("edgeName").isEmpty())) {
			response = validateServiceName(type, httpEntity.get("edgeName"));

		} else if (httpEntity.get("cloudletName") != null && !(httpEntity.get("cloudletName").isEmpty())) {
			response = validateServiceName(type, httpEntity.get("cloudletName"));

		} else if (httpEntity.get("imageName") != null && !(httpEntity.get("imageName").isEmpty())) {
			response = validateServiceName(type, httpEntity.get("imageName"));
		} else {
			throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
					PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
		}
		if (response == null) {
			throw new MECException(PortalConstants.NULL_RESPONSE_MESSAGE, PortalConstants.NULL_RESPONSE_CODE,
					PortalConstants.NULL_RESPONSE_STATUS, HttpStatus.NO_CONTENT);
		} else {
			logger.debug("Response Body: " + response.getBody());
		}
		return response;
	}

	public String getAvailableCredit(String userId) throws MECException {
		UserProfile userfile = userprofileHandler.getUserProfile(userId, credit);
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		sb.append("\n");
		sb.append("\"availableCredit\"");
		sb.append(":");
		sb.append("\"");
		sb.append(userfile.getCredits());
		sb.append("\"");
		sb.append("\n");
		sb.append("}");

		return sb.toString();

	}

}
