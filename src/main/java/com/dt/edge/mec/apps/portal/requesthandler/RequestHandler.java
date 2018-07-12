package com.dt.edge.mec.apps.portal.requesthandler;

import org.springframework.http.ResponseEntity;
public interface RequestHandler {
public ResponseEntity<?> handleRequest(Object requestData) throws Exception;
}
