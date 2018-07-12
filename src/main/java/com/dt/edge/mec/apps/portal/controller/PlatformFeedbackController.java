package com.dt.edge.mec.apps.portal.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

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
import com.dt.edge.mec.apps.portal.requesthandler.PlatformFBRequestHandler;
import com.dt.edge.mec.apps.portal.utility.PortalConstants;

@RestController
public class PlatformFeedbackController {

	@Autowired
	private PlatformFBRequestHandler requestHandler;

	private final Logger logger = LogManager.getLogger(PlatformFeedbackController.class.getName());

	/*
	 * Retrieve Feedback method
	 * 
	 * 
	 */
	@RequestMapping(value = "/platformFeedback/fetch", method = RequestMethod.GET)
	public ResponseEntity<?> fetchFeedbackList(
			@RequestParam(value = PortalConstants.FEEDBACK_CATEGORY, required = false) String category,
			@RequestParam(value = PortalConstants.PAGESIZE, required = false) String page_size,
			@RequestParam(value = PortalConstants.SORTBY, required = false) String sort_by,
			@RequestParam(value = PortalConstants.SORTORDER, required = false) String sort_order,
			@RequestParam(value = PortalConstants.PAGE_NUMBER, required = false) String page_number) throws Exception {
		Map<String, String> queryParam = new HashMap<String, String>();
		queryParam.put(PortalConstants.PAGESIZE, page_size);
		queryParam.put(PortalConstants.SORTBY, sort_by);
		queryParam.put(PortalConstants.SORTORDER, sort_order);
		queryParam.put(PortalConstants.PAGE_NUMBER, page_number);
		
		Map<String, String> matrixParam = new HashMap<String, String>();
		matrixParam.put(PortalConstants.FEEDBACK_CATEGORY, category);
		return requestHandler.getPlatformFeedback((HashMap<String, String>) queryParam,(HashMap<String, String>) matrixParam);

	}

	/*
	 * Posting Platform feedback
	 */
	/*
	 * @RequestMapping(value = "/platformFeedback/save", method =
	 * RequestMethod.POST, headers = "Accept=application/json") public
	 * ResponseEntity<?> savePlatformFeedback(@RequestBody String json,
	 * HttpSession session) throws Exception {
	 * logger.info("<<<< PlatformFeedbackController - savePlatformFeedback >>>>"
	 * ); String userId = (String) session.getAttribute(PortalConstants.USERID);
	 * logger.info("userId=" + userId); return
	 * requestHandler.savePlatformFeedback(userId, json); }
	 */

	@RequestMapping(value = "/platformFeedback/save", method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<?> savePlatformFeedback(@RequestParam(value = "files") MultipartFile[] files,
			@RequestParam(value = PortalConstants.FEEDBACK_CATEGORY, required = true) String category,
			@RequestParam(value = PortalConstants.FEEDBACK_COMMENTS, required = true) String comments,
			HttpSession session) throws Exception {
		logger.info("<<<< PlatformFeedbackController - savePlatformFeedback >>>>");
		String userId = (String) session.getAttribute(PortalConstants.USERID);
		logger.info("userId=" + userId + " category=" + category + " comments=" + comments);
		return requestHandler.savePlatformFeedback(userId, files, category, comments);
	}

	/*
	 * Download Platform Feedback Attachment
	 */
	@RequestMapping(value = "/downloadFeedbackFile/{feedbackFile}", method = RequestMethod.GET)
	public ResponseEntity<?> downloadFeedbackFile(@PathVariable("feedbackFile") String feedbackFile)
			throws MECException {
		logger.info("<<<< PlatformFeedbackController - downloadFeedbackFile >>>>"+feedbackFile);
		return requestHandler.downloadFBFile(feedbackFile);
	}

}
