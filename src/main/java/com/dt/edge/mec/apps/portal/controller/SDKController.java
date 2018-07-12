package com.dt.edge.mec.apps.portal.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dt.edge.mec.apps.portal.errorhandler.MECException;
import com.dt.edge.mec.apps.portal.requesthandler.SDKRequestHandler;

@RestController
public class SDKController {

	@Autowired
	private SDKRequestHandler requestHandler;
	private static final String SDK_VERSION = "sdkVersion";
	private static final String SDK_LANG = "sdkLanguage";
	private static final String SDK_NAME = "sdkName";
	private static final String SDK_IDENTIFIER = "identifier";
	private static final String SDK_DESCRIPTION = "description";

	private final Logger logger = LogManager.getLogger(SDKController.class.getName());

	@RequestMapping(value = "downloadSDK/{sdkName}/{identifier}", method = RequestMethod.GET)
	public ResponseEntity<?> downloadSDK(@PathVariable(SDK_NAME) String sdkName,@PathVariable(SDK_IDENTIFIER) String identifier) throws MECException {
		logger.info("<<<< SDKDownloadController - downloadSDK >>>>");
		logger.info("identifier=" + identifier + "sdkName= " + sdkName);
		return requestHandler.downloadSDK(sdkName,identifier);
	}

	@RequestMapping(value = "deleteSDK/{identifier}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteSDK(@PathVariable(SDK_IDENTIFIER) String identifier) throws MECException {
		logger.info("<<<< SDKDownloadController - deleteSDK >>>>");
		logger.info("identifier=" + identifier);
		return requestHandler.deleteSDK(identifier);
	}

	@RequestMapping(value = "uploadSDK/{sdkLanguage}/{sdkVersion}/{sdkName}", method = RequestMethod.PUT)
	public ResponseEntity<?> uploadSDK(@RequestParam(value = "files", required = true) MultipartFile file,
			@RequestParam(value = SDK_DESCRIPTION, required = false) String sdkDescription,@PathVariable(SDK_LANG) String sdkLang, @PathVariable(SDK_VERSION) String sdkVersion,
			@PathVariable(SDK_NAME) String sdkName) throws MECException {
		logger.info("<<<< SDKDownloadController - uploadSDK >>>>");
		logger.info("sdkLang=" + sdkLang + " sdkVersion=" + sdkVersion + " sdkName= " + sdkName);
		return requestHandler.uploadSDK(file, sdkLang, sdkVersion, sdkName,sdkDescription);
	}

	@RequestMapping(value = "listSDK", method = RequestMethod.GET)
	public ResponseEntity<?> listSDK() throws MECException {
		logger.info("<<<< SDKDownloadController - listSDK >>>>");
		return requestHandler.listSDK();
	}

}
