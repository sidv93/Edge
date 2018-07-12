package com.dt.edge.mec.apps.portal.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dt.edge.mec.apps.portal.requesthandler.BillingRequestHandler;
import com.dt.edge.mec.apps.portal.requesthandler.UserProfileRequestHandler;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@RestController
public class UserProfileController {
	@Autowired
	private BillingRequestHandler BillingRequestHandler;
	private final Logger logger = LogManager.getLogger(UserProfileController.class.getName());
	@Autowired
	private UserProfileRequestHandler userprofileHandler;

	/*
	 * getting userDetails based on ID
	 */
	@RequestMapping(value = "/userprofile/getUserDetails", method = RequestMethod.GET, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> getUserProfileDetails(@RequestParam(value = "userId", required = true) String userId)
			throws Exception {
		logger.info("<<<< UserProfileController - getUserProfileDetails >>>>");
		Map<String, String> requestData = new HashMap<String, String>();
		requestData.put("userId", userId);
		return userprofileHandler.GetUserProfile(requestData);

	}

	/*
	 * Saving userProfile details
	 */
	@RequestMapping(value = "/userprofile/saveUserDetails", method = RequestMethod.POST, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> saveUserProfileDetails(@RequestBody String json) throws Exception {
		logger.info("<<<< UserProfileController - setUserProfile >>>>");

		return userprofileHandler.SetUserProfile(json);
	}

	/*
	 * editing userprofile
	 */
	@RequestMapping(value = "/userprofile/SaveuserDetails", method = RequestMethod.PUT, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> editUserProfileDetails(@RequestBody String json) throws Exception {
		logger.info("<<<< UserProfileController - setUserDetails >>>>");
		return userprofileHandler.UpdateUserProfileRequest(json);

	}

	/*
	 * sending request to billing module. addordelete
	 */
	@RequestMapping(value = "/userprofile/addOrDeleteCredits", method = RequestMethod.POST, headers = PortalConstants.ACCEPT_HEADER)
	public ResponseEntity<?> addOrDeleteCredits(@RequestBody String json) throws Exception {
		logger.info("<<<< UserProfileController - setUserDetails >>>>");

		return BillingRequestHandler.addOrDeleteRequest(json);
	}

}
