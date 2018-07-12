package com.dt.edge.mec.apps.portal.controller;

import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dt.edge.mec.apps.portal.model.LoginData;
import com.dt.edge.mec.apps.portal.model.LoginModel;
import com.dt.edge.mec.apps.portal.model.SignUpData;
import com.dt.edge.mec.apps.portal.requesthandler.IAMRequestHandler;

@RestController
public class IAMController {
	@Autowired
	@Qualifier("IAMRequestHandler")
	private IAMRequestHandler requestHandler;
	private final Logger logger = LogManager.getLogger(IAMController.class.getName());
	@Value("${MEC.SessionTimeout}")
	private int sessionTimeout;

	/**
	 * Authenticate User
	 * 
	 * @param LoginData
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "authenticateUser", method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<LoginModel> login(@RequestBody LoginData LoginData, HttpSession session) throws Exception {
		logger.info("<<<< Login Controller - login method >>>>");
		ResponseEntity<LoginModel> response = (ResponseEntity<LoginModel>) requestHandler.handleloginRequest(LoginData);
		System.out.println("Inside IAMController response.getStatusCodeValue()=" + response.getStatusCodeValue());
		System.out.println("Inside IAMController session ID=" + session.getId());
		System.out.println("sessionTimeout=" + sessionTimeout);
		if (response != null && response.getStatusCodeValue() == 202) {
			session.setMaxInactiveInterval(sessionTimeout);
			session.setAttribute("accessToken", response.getBody().getAccessToken());
			session.setAttribute("userId", LoginData.getLoginModel().getUsername());
			response.getBody().setAccessToken(null);
		} else {
			session.invalidate();
		}
		return response;
	}

	@RequestMapping(value = "signUpOpsDevs", method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<?> signUp(@RequestBody SignUpData signupData) throws Exception {
		logger.info("<<<< SignupController - SignUpData >>>>");
		return requestHandler.handleSignUpRequest(signupData.getSignupModel());
	}
}
