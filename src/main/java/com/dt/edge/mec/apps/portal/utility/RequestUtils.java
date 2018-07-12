package com.dt.edge.mec.apps.portal.utility;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public class RequestUtils {
	
	 public static String generateMatrixString(Map<String, String> matrixParam) {
	        if (Collections.frequency(matrixParam.values(), null) == matrixParam.size() || matrixParam.size() == 0) {
	            return "";
	        }
	        ;
	        StringBuffer sb = new StringBuffer();
	        for (String s : matrixParam.keySet()) {
	            if (matrixParam.get(s) != null) {
	                sb.append(s);
	                sb.append("=");
	                sb.append(matrixParam.get(s));
	                sb.append(";");
	            }
	        }
	        return sb.toString().substring(0, sb.toString().length() - 1);
	    }

	 public static MultiValueMap<String, String> getQuerryMap(HashMap<String, String> querryParam) {
	        MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
	        for (Map.Entry<String, String> E : querryParam.entrySet()) {
	            if (E.getValue() != null)
	                params.add(E.getKey(), E.getValue());
	        }
	        return params;
	    }

}
