package com.dt.edge.mec.apps.portal.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;

@RestController
public class SessionTimeoutController {

	private final Logger logger = LogManager.getLogger(SessionTimeoutController.class.getName());

	@RequestMapping(value = "timeout", method = RequestMethod.GET)
	public ResponseEntity<?> sessionTimeout(HttpServletRequest request) throws MECException {
		ResponseEntity<?> response = null;
		logger.info("Inside SessionTimeoutController");
		request.getSession().invalidate();
		String message = "Session Timeout";
		String status = "failure";
		response = new ResponseEntity<>(new ResponseMessage("session-timeout", message, status),
				HttpStatus.BAD_GATEWAY);
		return response;
	}
}
