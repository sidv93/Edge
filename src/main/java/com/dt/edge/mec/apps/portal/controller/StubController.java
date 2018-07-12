package com.dt.edge.mec.apps.portal.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dt.edge.mec.apps.portal.errorhandler.MECException;

@RestController
public class StubController {
	private final Logger logger = LogManager.getLogger(StubController.class.getName());

	@RequestMapping(value = "fetch", method = RequestMethod.GET)
	public ResponseEntity<?> fetchFeedback() throws Exception {
		JSONParser parser = new JSONParser();
		JSONArray obj1 = (JSONArray) parser
				.parse(new FileReader("C:\\Users\\gur13344\\Desktop\\stub\\platformFeedback.txt"));
		logger.info("Inside fetchFeedback" + obj1.toString());
		return new ResponseEntity<>(obj1, HttpStatus.OK);
	}

	@RequestMapping(value = "fetch/{name}", method = RequestMethod.GET)
	public ResponseEntity<?> fetchFeedbackByCrtr(@PathVariable("name") String name) throws Exception {
		System.out.println(name);
		JSONParser parser = new JSONParser();
		JSONArray obj1 = (JSONArray) parser
				.parse(new FileReader("C:\\Users\\gur13344\\Desktop\\stub\\platformFeedback.txt"));
		logger.info("Inside fetchFeedbackByCrtr" + obj1.toString());
		return new ResponseEntity<>(obj1, HttpStatus.OK);
	}

	/*
	 * Posting Platform feedback
	 */
	@RequestMapping(value = "save/{name}", method = RequestMethod.POST)
	public ResponseEntity<?> HandledEdgePOST() throws Exception {
		return new ResponseEntity<>(HttpStatus.OK);

	}

	/*
	 * Delete SDK
	 */
	@RequestMapping(value = "/api/v1.0/sms/sdk/{sdkLang}/{sdkVersion}/{sdkName}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteSDK(@PathVariable("sdkLang") String sdkLang,
			@PathVariable("sdkVersion") String sdkVersion, @PathVariable("sdkName") String sdkName) {
		logger.info("<<<< StubController - deleteSDK >>>>");
		System.out.println("Inside deletesdk stub");
		JSONParser parser = new JSONParser();
		JSONObject obj1 = null;
		try {
			obj1 = (JSONObject) parser.parse(new FileReader("C:\\Users\\gur13344\\Desktop\\stub\\deleteSDK.txt"));
		} catch (IOException | ParseException e) {
			// TODO Auto-generated catch block
			System.out.println("Inside deletesdk stub exception=" + e.getMessage());
			e.printStackTrace();
		}
		logger.info("<<<< StubController - deleteSDK >>>>obj1=" + obj1.toString());
		return new ResponseEntity<>(obj1, HttpStatus.OK);
	}

	/*
	 * Delete SDK
	 */
	@RequestMapping(value = "/api/v1.0/sms/sdk/{sdkLang}/{sdkVersion}/{sdkName}", method = RequestMethod.GET)
	public ResponseEntity<?> getSDK() throws MECException {
		logger.info("<<<< StubController - getSDK >>>>");

		return new ResponseEntity<>(HttpStatus.OK);
	}

	/*
	 * Upload SDK
	 */
	@RequestMapping(value = "/api/v1.0/sms/sdk/{sdkLang}/{sdkVersion}/{sdkName}", method = RequestMethod.PUT)
	public ResponseEntity<String> uploadSDK(@RequestParam("file") MultipartFile file,
			@PathVariable("sdkLang") String sdkLang, @PathVariable("sdkVersion") String sdkVersion,
			@PathVariable("sdkName") String sdkName) throws MECException {
		logger.info("<<<< StubController - uploadSDK >>>>");
		System.out.println("Inside upload SDK stub");
		JSONParser parser = new JSONParser();
		JSONObject obj1 = null;
		String fileName = null;
		if (!file.isEmpty()) {
			try {
				fileName = file.getOriginalFilename();
				byte[] bytes = file.getBytes();
				BufferedOutputStream buffStream = new BufferedOutputStream(
						new FileOutputStream(new File("D://" + fileName)));
				buffStream.write(bytes);
				buffStream.close();
				obj1 = (JSONObject) parser.parse(new FileReader("C:\\Users\\gur13344\\Desktop\\stub\\uploadSDK.txt"));
				logger.info("<<<< StubController - upload sdk >>>>obj1=" + obj1.toString());
				return new ResponseEntity<String>(obj1.toString(), HttpStatus.OK);
			} catch (Exception e) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		} else {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

	}

	
	/*
	 * Upload Feedback
	 */
	@RequestMapping(value = "/api/v1.0/feedback", method = RequestMethod.POST)
	public ResponseEntity<String> uploadFeedback(@RequestParam("file") MultipartFile file,@RequestParam(value = "category", required = true) String category,@RequestParam(value = "comments", required = true) String comments) throws MECException {
		logger.info("<<<< StubController - uploadFeedback >>>>");
		System.out.println("Inside uploadFeedback stub");
		JSONParser parser = new JSONParser();
		JSONObject obj1 = null;
		String fileName = null;
		if (!file.isEmpty()) {
			try {
				fileName = file.getOriginalFilename();
				byte[] bytes = file.getBytes();
				BufferedOutputStream buffStream = new BufferedOutputStream(
						new FileOutputStream(new File("D://" + fileName)));
				buffStream.write(bytes);
				buffStream.close();
				obj1 = (JSONObject) parser.parse(new FileReader("C:\\Users\\gur13344\\Desktop\\stub\\uploadSDK.txt"));
				logger.info("<<<< StubController - uploadFeedback >>>>obj1=" + obj1.toString());
				return new ResponseEntity<String>(obj1.toString(), HttpStatus.OK);
			} catch (Exception e) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		} else {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

	}

}
