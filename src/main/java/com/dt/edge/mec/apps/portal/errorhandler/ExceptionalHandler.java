package com.dt.edge.mec.apps.portal.errorhandler;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dt.edge.mec.apps.portal.model.ResponseMessage;

@ControllerAdvice
public class ExceptionalHandler {
     
    @Autowired
    private ResponseMessage responseMessage;
    private final Logger logger = LogManager.getLogger(ExceptionalHandler.class.getName());
    @ResponseBody
    @ExceptionHandler(MECException.class)
    public ResponseEntity<?> handleError(HttpServletRequest req, MECException ex) {
    	responseMessage.setCode(ex.getHttpStatus().toString());
    	responseMessage.setMessage(ex.getErrorMsg());
    	responseMessage.setStatus(ex.getStatus());
    	logger.debug("returning Error response with status: "+ex.getHttpStatus().toString() +
    			" and Error Message "+responseMessage.toString());
    	return new ResponseEntity<ResponseMessage>(responseMessage,ex.getHttpStatus());
       
    }
 
}