package com.dt.edge.mec.apps.portal.utility;

import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.dt.edge.mec.apps.portal.model.AuthorizationToken;
import com.dt.edge.mec.apps.portal.model.ErrorMessage;
import com.dt.edge.mec.apps.portal.model.SignUpModel;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JSONUtility {
	private static final Logger logger = LogManager.getLogger(JSONUtility.class.getName());

	/**
	 * 
	 * @param json
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public static ErrorMessage jsonToErrorObject(String json)
			throws JsonParseException, JsonMappingException, IOException {
		logger.info("<<<< JSONUtility - jsonToErrorObject >>>>");
		ObjectMapper mapper = new ObjectMapper();
		//ErrorMessage err = new ErrorMessage();
		ErrorMessage err = (ErrorMessage) mapper.readValue(json, ErrorMessage.class);
		return err;
	}
	
	/**
	 * 
	 * @param json
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public static SignUpModel jsonToSignUpModel(String json)
			throws JsonParseException, JsonMappingException, IOException {
		logger.info("<<<< JSONUtility - jsonToSignUpModel >>>>");
		ObjectMapper mapper = new ObjectMapper();
		//SignUpModel sgn = new SignUpModel();
		SignUpModel sgn = (SignUpModel) mapper.readValue(json, SignUpModel.class);
		return sgn;
	}
	
	/**
	 * 
	 * @param json
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public static AuthorizationToken jsonToTokenUpModel(String json)
			throws JsonParseException, JsonMappingException, IOException {
		logger.info("<<<< JSONUtility - jsonToTokenUpModel >>>>");
		ObjectMapper mapper = new ObjectMapper();
		//AuthorizationToken sgn = new AuthorizationToken();
		AuthorizationToken sgn = (AuthorizationToken) mapper.readValue(json, AuthorizationToken.class);
		return sgn;
	}
}
