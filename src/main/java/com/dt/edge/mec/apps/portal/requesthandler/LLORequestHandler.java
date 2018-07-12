package com.dt.edge.mec.apps.portal.requesthandler;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.helper.GenerateRequest;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@Component
public class LLORequestHandler {
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;

	@Value("${MEC.LLO}")
	private String LLOURI;

	private String LLOMODULENAME;
	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	@Autowired
	private GetBaseUrl baseUrl;
	@Autowired
	GenerateRequest generateRequest;
	private final Logger logger = LogManager.getLogger(LLORequestHandler.class.getName());

	@PostConstruct
	private void init() {
		System.out.println("LLO" + LLOURI);
		LLOMODULENAME = moduleNameMap.get("LLOMODULE");
		logger.info("LLO" + baseUrl.getBaseUri(LLOMODULENAME));
	}

	private String getLLObaseUri() {
		return baseUrl.getBaseUri(LLOMODULENAME);
	}

	public ResponseEntity<?> deleteRequest(String edgeName, String cloudletName, String url) throws MECException {
		logger.info("<<<< entry deleteRequest >>>>");
		logger.info("Got request to Delete :" + cloudletName);
		UriComponentsBuilder builder = null;
		if (url.contains("deleteCloudlets")) {
			logger.info("Request triggerd for deleting cloudlet");
			builder = UriComponentsBuilder
					.fromHttpUrl(getLLObaseUri() + LLOURI + "/" + edgeName + "/cloudlet/" + cloudletName + "/");
		} else if (url.contains("deleteCloudletImage")) {
			logger.info("Request triggerd for deleting cloudlet image");
			builder = UriComponentsBuilder
					.fromHttpUrl(getLLObaseUri() + LLOURI + "/" + edgeName + "/image/" + cloudletName + "/");
		}
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.DELETE);
		ResponseEntity<String> responseEntityDeleteApplication = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit deleteRequest >>>>");
		return new ResponseEntity<ResponseMessage>(new ResponseMessage(
				responseEntityDeleteApplication.getStatusCode().toString(), "Deletion Done", "success"), HttpStatus.OK);
	}

	public ResponseEntity<?> edgeTesting(String edgeName) throws MECException {
		logger.info("<<<< entry edgeTesting >>>>");
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getLLObaseUri() + LLOURI + "/" + edgeName + "/");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		logger.info("Request triggerd for edge test connection in cloudlet onboard");
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		logger.info("<<<< exit edgeTesting >>>>");
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage(responseEntity.getStatusCode().toString(), "Edge Connectivity Tested", "success"),
				HttpStatus.OK);
	}

	public ResponseEntity<?> saveMetaData(String jason, String edgeName, String cloudletsName, String type)
			throws MECException {
		logger.info("<<<< enter LLORequestHandler - saveMetaData >>>>");
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.APPLICATION_JSON);
		UriComponentsBuilder builder = null;
		if (type.equals("cloudlet")) {
			logger.info("Request triggerd to LLO for cloudlet onboarding");
			builder = UriComponentsBuilder
					.fromHttpUrl(getLLObaseUri() + LLOURI + "/" + edgeName + "/cloudlet/" + cloudletsName + "/");
		} else if (type.equals("cloudletImage")) {
			logger.info("Request triggerd to LLO for cloudlet image onboarding");
			builder = UriComponentsBuilder
					.fromHttpUrl(getLLObaseUri() + LLOURI + "/" + edgeName + "/image/" + cloudletsName + "/");
		} else {
			throw new MECException("Server Error Happened", "Invalid Request", PortalConstants.FAILURE_STRING,
					HttpStatus.FAILED_DEPENDENCY);
		}
		HttpEntity<String> entity = new HttpEntity<String>(jason, headers);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("methodType", HttpMethod.POST);
		reqMap.put("httpEntity", entity);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		String message = "Cloudlet Onboard Request Sent";
		logger.info("<<<< exit LLORequestHandler - saveMetaData >>>>");
		return new ResponseEntity<>(new ResponseMessage(responseEntity.getStatusCode().toString(), message, "success"),
				HttpStatus.OK);
	}

}
