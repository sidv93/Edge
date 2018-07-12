package com.dt.edge.mec.apps.portal.model;

public class Applications
{
    private String releaseDate;

    private String userId;

    private String image;

    private String rating;

    private String applicationName ;

    public String getReleaseDate ()
    {
        return releaseDate;
    }

    public void setReleaseDate (String releaseDate)
    {
        this.releaseDate = releaseDate;
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

    public String getapplicationName  ()
    {
        return applicationName ;
    }

    public void setapplicationName  (String applicationName )
    {
        this.applicationName  = applicationName ;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [releaseDate = "+releaseDate+", userId = "+userId+", image = "+image+", rating = "+rating+", applicationName  = "+applicationName +"]";
    }
}
