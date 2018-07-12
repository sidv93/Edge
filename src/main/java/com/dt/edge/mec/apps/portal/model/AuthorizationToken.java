
package com.dt.edge.mec.apps.portal.model;

public class AuthorizationToken {
    private String grant_type;
    private String client_id;
    private String access_token;
    private String token_type;
    private int expires_in;
    private String refresh_token;
    private String[] userType;
    private String companyName;
    private String userId;
    
    public AuthorizationToken() {
        super();
    }

    public AuthorizationToken(String access_token, String token_type, int expires_in,
            String refresh_token, String[] userType, String userId,String companyName) {
        super();
        this.access_token = access_token;
        this.token_type = token_type;
        this.expires_in = expires_in;
        this.refresh_token = refresh_token;
        this.userType = userType;
        this.userId = userId;
        this.companyName = companyName;
    }

  

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getGrant_type() {
        return grant_type;
    }

    public void setGrant_type(String grant_type) {
        this.grant_type = grant_type;
    }

    public String getClient_id() {
        return client_id;
    }

    public void setClient_id(String client_id) {
        this.client_id = client_id;
    }


    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getToken_type() {
        return token_type;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public int getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(int expires_in) {
        this.expires_in = expires_in;
    }

    public String getRefresh_token() {
        return refresh_token;
    }

    public void setRefresh_token(String refresh_token) {
        this.refresh_token = refresh_token;
    }

    public String getuserId() {
        return userId;
    }

    public void setuserId(String userId) {
        this.userId = userId;
    }

    public String[] getUserType() {
        return userType;
    }

    public void setUserType(String[] userType) {
        this.userType = userType;
    }

    @Override
    public String toString() {
        return "AuthorizationToken [access_token=" + access_token + ", token_type=" + token_type
                + ", expires_in=" + expires_in + ", refresh_token=" + refresh_token + ", userType="
                + userType + ", userId=" + userId + "]";
    }


}
