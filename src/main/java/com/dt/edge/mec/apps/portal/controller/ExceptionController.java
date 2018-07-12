package com.dt.edge.mec.apps.portal.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.dt.edge.mec.apps.portal.errorhandler.InvalidClientException;
import com.dt.edge.mec.apps.portal.model.ResponseMessage;

@ControllerAdvice
public class ExceptionController {

    @ExceptionHandler(value = InvalidClientException.class)
    public ResponseEntity<?> exception(InvalidClientException exception) {
    	String message = "Invalid Client";
		String status ="failure";
        return new ResponseEntity<>(new ResponseMessage("invalid-client", message, status),HttpStatus.BAD_REQUEST);
    }

}