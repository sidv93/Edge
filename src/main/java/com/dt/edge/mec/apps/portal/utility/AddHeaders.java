package com.dt.edge.mec.apps.portal.utility;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.dt.edge.mec.apps.portal.authorization.IAMTokenManager;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.iam.proxy.OAuthToken;

public class AddHeaders {
	private final static Logger logger = LogManager.getLogger(AddHeaders.class.getName());

	public static HttpHeaders addAccesstokenHeader(HttpHeaders headers) throws MECException {
		// logger.info("in add headers");
		OAuthToken oauth = IAMTokenManager.getOauthToken();
		if (oauth == null) {
			// logger.info("No access token found");
			headers.add("accessToken", "");
			return headers;
			// used after full IAM integration
			/*
			 * throw new MECException("Could not get access token", "424",
			 * "Failure", HttpStatus.OK);
			 */
		} else if (oauth.getAccessToken() == null
				|| oauth.getStatus().equalsIgnoreCase(IAMTokenManager.failureString)) {
			logger.info("No access token found");
			headers.add("accessToken", "");
			return headers;
			// used after full IAM integration
			// throw new MECException("Could not get access token", "424",
			// "Failure", HttpStatus.OK);
		}
		headers.add("accessToken", oauth.getAccessToken());
		;
		logger.info("access Token added" + oauth.getAccessToken());
		return headers;

	}
	
	public static HttpHeaders generateHeaders(MediaType mediaType) throws MECException {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(mediaType);
		headers = AddHeaders.addAccesstokenHeader(headers);
		return headers;

	}
}
