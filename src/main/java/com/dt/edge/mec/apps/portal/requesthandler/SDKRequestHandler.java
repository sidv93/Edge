package com.dt.edge.mec.apps.portal.requesthandler;

import java.io.IOException;
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
import com.dt.edge.mec.apps.portal.utility.AddHeaders;
import com.dt.edge.mec.apps.portal.utility.GetBaseUrl;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@Component
public class SDKRequestHandler {
	private String smsModuleName;
	private String cloudletModuleName;
	@Value("#{${MEC.SDKMANAGERSERVICEMAP}}")
	private Map<String, String> smsMapUri;
	@Value("#{${MEC.MODULENAMEMAP}}")
	private Map<String, String> moduleNameMap;
	@Autowired
	GenerateRequest generateRequest;
	@Autowired
	ErrorCodes errCodes;
	@Autowired
	ClientErrorHandler clientErrorHandler;
	private String manageSDK;
	private String listSDK;
	@Autowired
	private GetBaseUrl baseUrl;
	private static final String SMS_MODULE = "SDKManagerService";
	private static final String CLOUDLET_MODULE = "CloudletModule";
	private static final String MANAGE_SDK = "manageSDK";
	private static final String LIST_SDK = "listSDK";
	private final Logger logger = LogManager.getLogger(SDKRequestHandler.class.getName());

	@PostConstruct
	public void init() {
		smsModuleName = moduleNameMap.get(SMS_MODULE);
		cloudletModuleName = moduleNameMap.get(CLOUDLET_MODULE);
		manageSDK = smsMapUri.get(MANAGE_SDK);
		listSDK = smsMapUri.get(LIST_SDK);
	}

	private String getsmsBaseUri() {
		return baseUrl.getBaseUri(smsModuleName);
	}
	
	private String getcloudletBaseUri() {
		return baseUrl.getBaseUri(cloudletModuleName);
	}

	/*
	 * Sending request for artifactory download
	 */
	public ResponseEntity<?> downloadSDK(String sdkName, String identifier) throws MECException {
		logger.info("<<<< enter ArtifactRequestHandler - downloadSDK >>>>");
		logger.debug("Sending request to Artifactory for  " + identifier);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getsmsBaseUri() + manageSDK + "/" + identifier);
		logger.info("Request triggerd for downloading SDK");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_OCTET_STREAM);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Connection", "keep-alive");
		headers.add("Content-Disposition", "attachment;filename=" + sdkName);
		return new ResponseEntity<String>(responseEntity.getBody(), headers, HttpStatus.OK);
	}

	public ResponseEntity<?> listSDK() throws MECException {
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getcloudletBaseUri() + listSDK);
		logger.info("Request triggerd for getting SDK list");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.GET);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<String>(responseEntity.getBody().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> deleteSDK(String identifier) throws MECException {
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(getsmsBaseUri() + manageSDK + "/" + identifier);
		logger.info("Request triggerd for deleting SDK:");
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("mediaType", MediaType.APPLICATION_JSON);
		reqMap.put("methodType", HttpMethod.DELETE);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<String>(responseEntity.getStatusCode().toString(), HttpStatus.OK);
	}

	public ResponseEntity<?> uploadSDK(MultipartFile file, String sdkLang, String sdkVersion, String sdkName,
			String sdkDescription) throws MECException {
		HttpHeaders headers = AddHeaders.generateHeaders(MediaType.MULTIPART_FORM_DATA);
		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(getsmsBaseUri() + manageSDK + "/" + sdkLang + "/" + sdkVersion + "/" + sdkName);
		logger.info("Request triggerd for uploading SDK");
		MultiValueMap<String, Object> parts = new LinkedMultiValueMap<String, Object>();
		// parts.add("file", new ByteArrayResource(file.getBytes()));
		final String filename = file.getOriginalFilename();
		parts.add("name", filename);
		parts.add("filename", filename);
		byte[] bytes;
		try {
			bytes = file.getBytes();
		} catch (IOException e) {
			logger.debug("Caught Exception " + e.getMessage());
			throw new MECException(PortalConstants.SERVER_ERROR_STRING, PortalConstants.SERVER_ERROR_STRING,
					PortalConstants.FAILURE_STRING, HttpStatus.FAILED_DEPENDENCY);
		}
		ByteArrayResource contentsAsResource = new ByteArrayResource(bytes) {
			public String getFilename() {
				return filename;
			}
		};

		parts.add("file", contentsAsResource);
		parts.add("description", sdkDescription);
		HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<MultiValueMap<String, Object>>(parts,
				headers);
		logger.info("Http entity " + entity);
		HashMap<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("builder", builder);
		reqMap.put("methodType", HttpMethod.PUT);
		reqMap.put("httpEntity", entity);
		ResponseEntity<String> responseEntity = generateRequest.executeRequest(reqMap);
		return new ResponseEntity<String>(responseEntity.getStatusCode().toString(), HttpStatus.OK);
	}

}
