package com.dt.edge.mec.apps.portal.model;

public class Microservices
{
    private String microServiceName ;

    private String userId;

    private String image;

    private String rating;

    public Microservices() {
		super();
	}

	public String getMicroServiceName  ()
    {
        return microServiceName ;
    }

    public void setMicroServiceName  (String microServiceName )
    {
        this.microServiceName  = microServiceName ;
    }

    public String getUserId ()
    {
        return userId;
    }

    public void setUserId (String userId)
    {
        this.userId = userId;
    }

    public String getImage ()
    {
        return image;
    }

    public void setImage (String image)
    {
        this.image = image;
    }

    public String getRating ()
    {
        return rating;
    }

    public void setRating (String rating)
    {
        this.rating = rating;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [microServiceName  = "+microServiceName +", userId = "+userId+", image = "+image+", rating = "+rating+"]";
    }
}