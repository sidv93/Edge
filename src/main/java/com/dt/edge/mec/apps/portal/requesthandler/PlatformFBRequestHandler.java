package com.dt.edge.mec.apps.portal.requesthandler;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.dt.edge.mec.apps.portal.errorhandler.ClientErrorHandler;
import com.dt.edge.mec.apps.portal.errorhandler.ErrorCodes;
import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.helper.GenerateRequest;

import com.dt.edge.mec.apps.portal.model.ResponseMessage;
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.FileUtils;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;
import com.dt.edge.mec.apps.portal.utility.RequestUtils;

@Component
public class PlatformFBRequestHandler {
	private String platformFBBaseURI;
	private String userModuleBaseURI;
	@Value("#{${MEC.PLATFORMFBURIMAP}}")
	private Map<String, String> platformFBMapUri;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	@Autowired
	GenerateRequest generateRequest;
	private String submitFeedback;
	private String listFeedback;
	private String feedbackAttach;
	@Autowired
	private GetBaseUrl baseUrl;
	private static final String PLATFORM_FEEDBACK = "PlatformFeedback";
	private static final String LIST_FEEDBACK = "fetchFBCR";
	private static final String DOWNLOAD_FEEDBACK_ATTACH = "fetchFBAttachment";
	private static final String POST_FEEDBACK = "postFB";
	private final Logger logger = LogManager.getLogger(PlatformFBRequestHandler.class.getName());

	@PostConstruct
	public void init() {
		platformFBBaseURI = moduleNameMap.get(PLATFORM_FEEDBACK);
		userModuleBaseURI = moduleNameMap.get(PortalConstants.USER_MODULE);
		submitFeedback = platformFBMapUri.get(POST_FEEDBACK);
		listFeedback = platformFBMapUri.get(LIST_FEEDBACK);
		feedbackAttach = platformFBMapUri.get(DOWNLOAD_FEEDBACK_ATTACH);

	}

	private String getPlatformFBBaseUri() {
		return baseUrl.getBaseUri(platformFBBaseURI);
	}

	private String getUserModuleBaseUri() {
		return baseUrl.getBaseUri(userModuleBaseURI);
	}

	public ResponseEntity<?> getPlatformFeedback(HashMap<String, String> queryParam,
			HashMap<String, String> matrixParam) throws MECException {
		ResponseEntity<String> responseEntity = null;
		String matrixSring = RequestUtils.generateMatrixString(matrixParam);
		MultiValueMap<String, String> params = RequestUtils.getQuerryMap((HashMap<String, String>) queryParam);
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getUserModuleBaseUri() + listFeedback + matrixSring).queryParams(params);
		logger.info("Request triggerd for getting all platform feedback");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> savePlatformFeedback(String userId, MultipartFile[] file, String category, String comments)
			throws MECException {
		logger.info("<<<< enter PlatformFBRequestHandler - savePlatformFeedback >>>>");
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.MULTIPART_FORM_DATA);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getPlatformFBBaseUri() + submitFeedback);
		MultiValueMap<String, Object> parts = new LinkedMultiValueMap<String, Object>();
		if (file.length > 0) {
			byte[] bytes = null;
			try {
				bytes = FileUtils.createZipFile(file);
				logger.info("zip file is empty");
				if (bytes == null) {
					throw new MECException(PortalConstants.NULL_RESPONSE_MESSAGE, PortalConstants.NULL_RESPONSE_CODE,
							PortalConstants.NULL_RESPONSE_STATUS, HttpStatus.NO_CONTENT);
				}
			} catch (IOException e) {
				logger.debug("Caught Exception " + e.getMessage());
				throw new MECException(PortalConstants.SERVER_ERROR_STRING, PortalConstants.SERVER_ERROR_STRING,
						PortalConstants.FAILURE_STRING, HttpStatus.FAILED_DEPENDENCY);
			}
			logger.info("byte[]=" + Arrays.toString(bytes));
			final String filename = userId + "_" + String.valueOf((new Timestamp(System.currentTimeMillis())).getTime())
					+ ".zip";
			logger.info("zip filename=" + filename);
			ByteArrayResource contentsAsResource = new ByteArrayResource(bytes) {
				public String getFilename() {
					return filename;
				}
			};
			parts.add("name", filename);
			parts.add("filename", filename);
			parts.add("file", contentsAsResource);
		}
		parts.add(PortalConstants.FEEDBACK_CATEGORY, category);
		parts.add(PortalConstants.FEEDBACK_COMMENTS, comments);
		parts.add(PortalConstants.USERID, userId);
		logger.info("PortalConstants.FEEDBACK_CATEGORY=" + parts.get(PortalConstants.FEEDBACK_CATEGORY));
		logger.info("PortalConstants.FEEDBACK_COMMENTS=" + parts.get(PortalConstants.FEEDBACK_COMMENTS));
		logger.info("PortalConstants.USERID=" + parts.get(PortalConstants.USERID));
		logger.info("Request triggerred for saving platform feedback");
		HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<MultiValueMap<String, Object>>(parts,
				headers);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("methodType", HttpMethod.PUT);
		reqMap.put("httpEntity", entity);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		// SSLCertificateValidation.disable();
		String message = "Feedback Saved Succesfully";
		return new ResponseEntity<>(
				new ResponseMessage(responseEntity.getStatusCode().toString(), message, PortalConstants.SUCCESS_STRING),
				HttpStatus.OK);

	}

	public ResponseEntity<?> downloadFBFile(String feedbackFile) throws MECException {
		logger.info("<<<< enter PlatformFBRequestHandler - downloadFBFile >>>>");
		logger.debug("Sending request to Artifactory for  " + feedbackFile);
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getPlatformFBBaseUri() + feedbackAttach + "/" + feedbackFile);
		logger.info("Request triggerd for downloading feedback file:");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_OCTET_STREAM);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Connection", "keep-alive");
		headers.add("Content-Disposition", "attachment;filename=" + feedbackFile);
		return new ResponseEntity<String>(responseEntity.getBody(), headers, HttpStatus.OK);

	}

}
