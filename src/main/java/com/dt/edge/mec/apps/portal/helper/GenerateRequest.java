package com.dt.edge.mec.apps.portal.helper;

import java.util.HashMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.errorhandler.RestErrorHandler;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@Component
public class GenerateRequest {

	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	
	private final Logger logger = LogManager.getLogger(GenerateRequest.class.getName());

	public ResponseEntity<String> executeRequest(HashMap<String, Object> requestMap) throws MECException {
		UriComponentsBuilder builder = (UriComponentsBuilder) requestMap.get("builder");
		if (builder == null) {
			throw new MECException(PortalConstants.INVALID_ACCESS_MESSAGE, PortalConstants.INVALID_ACCESS_CODE,
					PortalConstants.INVALID_ACCESS_STATUS, HttpStatus.BAD_REQUEST);
		}
		logger.info("URL triggerred:" + builder.build().encode().toUri());
		HttpMethod methodType = (HttpMethod) requestMap.get("methodType");
		ResponseEntity<String> responseEntity = null;
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.setErrorHandler(new RestErrorHandler(errCodes.getErrorStatus()));
		try {
			HttpEntity<?> entity = null;
			logger.info("methodType:"+methodType);
			if(methodType != null && (methodType.equals(HttpMethod.GET)||methodType.equals(HttpMethod.DELETE))){
				logger.debug("Inside Get/Delete");
				MediaType mediaType = (MediaType) requestMap.get("mediaType");
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(mediaType);
				headers = AddHeaders.addAccesstokenHeader(headers);
			    entity = new HttpEntity<>(headers);
			}if(methodType != null && (methodType.equals(HttpMethod.PUT)||methodType.equals(HttpMethod.POST))){
				logger.debug("Inside Put/Post");
				entity = (HttpEntity<?>) requestMap.get("httpEntity");
				if(entity != null && entity.getBody() != null){
					logger.debug("Request body:" + entity.getBody().toString());
				}
			}
			responseEntity = restTemplate.exchange(builder.build().encode().toUri(), methodType, entity, String.class);
			if (responseEntity == null) {
				throw new MECException(PortalConstants.NULL_RESPONSE_MESSAGE, PortalConstants.NULL_RESPONSE_CODE,
						PortalConstants.NULL_RESPONSE_STATUS, HttpStatus.NO_CONTENT);
			}else{
				logger.debug("Response Body: " + responseEntity.getBody());
			}
			clientErrorHandler.handleClientEror(responseEntity, errCodes.getErrorStatus());
		} catch (Exception e) {
			logger.info("exception " + e.getMessage());
			if (e instanceof MECException) {
				throw e;
			}
			throw new MECException(PortalConstants.SERVER_ERROR_STRING, PortalConstants.SERVER_ERROR_STRING,
					PortalConstants.FAILURE_STRING, HttpStatus.FAILED_DEPENDENCY);
		}
		return responseEntity;
	}

}
