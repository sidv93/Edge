package com.dt.edge.mec.apps.portal.errorhandler;

import java.io.IOException;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;

public class RestErrorHandler extends DefaultResponseErrorHandler {
	  private List<String> errList;
	  private final Logger logger = LogManager.getLogger(RestErrorHandler.class.getName());
	  @Override
	  public void handleError(ClientHttpResponse response) throws IOException {  
		//handle exception which are not client defined 
		  throw new MECException("SERVER EXCEPTION",response.getStatusCode().toString(),"FAILURE",response.getStatusCode());
	  }

	  @Override
	  public boolean hasError(ClientHttpResponse response) throws IOException {
		  // add all the client error codes here
		  if(errList.contains(response.getStatusCode().toString())){
		  logger.debug("Ignoring Client Error with status Code: " +response.getStatusCode().toString() );
		  return false;
		  }
		  return super.hasError(response);
	  }

	public RestErrorHandler(List<String> errList) {
		super();
		this.errList = errList;
	}

	public List<String> getErrList() {
		return errList;
	}

	public void setErrList(List<String> errList) {
		this.errList = errList;
	}

		
	}