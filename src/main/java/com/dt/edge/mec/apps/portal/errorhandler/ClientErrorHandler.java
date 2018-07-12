package com.dt.edge.mec.apps.portal.errorhandler;

import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.dt.edge.mec.apps.portal.model.ErrorMessage;
import com.dt.edge.mec.apps.portal.utility.JSONUtility;

@Component
public class ClientErrorHandler {
	@Autowired
	private ErrorCodes errCode;
	private boolean hasError;
	private ErrorMessage errMessage = new ErrorMessage();
	private final Logger logger = LogManager.getLogger(ClientErrorHandler.class.getName());

	public void handleClientEror(ResponseEntity<?> response, List<String> errorList) throws MECException {
		// logger.info("<<<< ClientErrorHandler - handleClientEror >>>>");
		hasError = false;
		if (errorList.contains(response.getStatusCode().toString())) {
			hasError = true;
		}
		if (hasError) {

			try {
				logger.debug("Caught Client Error with body :" + response.getBody().toString());
				logger.info("Caught Client Error with Http Status : " + response.getStatusCode().toString());
				errMessage = JSONUtility.jsonToErrorObject(response.getBody().toString());
			} catch (Exception e) {
				logger.debug("caught exception" + e.getMessage());
				throw new MECException("Server Exception", "server excption", "Failure", HttpStatus.FAILED_DEPENDENCY);
			}
			throw new MECException(errMessage.getMessage(), errMessage.getCode(), errMessage.getStatus(),
					response.getStatusCode());

		}
	}
}
