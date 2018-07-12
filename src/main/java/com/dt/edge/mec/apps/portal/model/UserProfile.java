package com.dt.edge.mec.apps.portal.model;

import java.util.List;

public class UserProfile {
	private String lastName;

    private String contactNumber;

    private CardInfo cardInfo;

    private String state;

    private String credits;

    private String companyName;

    private String password;

    private  List <String>userType;

    private String country;

    private String userId;

    private String email;

    private String address;

    private String profilePic;

    private String firstName;

    public String getLastName ()
    {
        return lastName;
    }

    public void setLastName (String lastName)
    {
        this.lastName = lastName;
    }

    public String getContactNumber ()
    {
        return contactNumber;
    }

    public void setContactNumber (String contactNumber)
    {
        this.contactNumber = contactNumber;
    }

    public CardInfo getCardInfo ()
    {
        return cardInfo;
    }

    public void setCardInfo (CardInfo cardInfo)
    {
        this.cardInfo = cardInfo;
    }

    public String getState ()
    {
        return state;
    }

    public void setState (String state)
    {
        this.state = state;
    }

    public String getCredits ()
    {
        return credits;
    }

    public void setCredits (String credits)
    {
        this.credits = credits;
    }

    public String getCompanyName ()
    {
        return companyName;
    }

    public void setCompanyName (String companyName)
    {
        this.companyName = companyName;
    }

    public String getPassword ()
    {
        return password;
    }

    public void setPassword (String password)
    {
        this.password = password;
    }

    public List<String> getUserType ()
    {
        return userType;
    }

    public void setUserType (List<String> userType)
    {
        this.userType = userType;
    }

    public String getCountry ()
    {
        return country;
    }

    public void setCountry (String country)
    {
        this.country = country;
    }

    public String getUserId ()
    {
        return userId;
    }

    public void setUserID (String userId)
    {
        this.userId = userId;
    }

    public String getEmail ()
    {
        return email;
    }

    public void setEmail (String email)
    {
        this.email = email;
    }

    public String getAddress ()
    {
        return address;
    }

    public void setAddress (String address)
    {
        this.address = address;
    }

    public String getProfilePic ()
    {
        return profilePic;
    }

    public void setProfilePic (String profilePic)
    {
        this.profilePic = profilePic;
    }

    public String getFirstName ()
    {
        return firstName;
    }

    public void setFirstName (String firstName)
    {
        this.firstName = firstName;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [lastName = "+lastName+", contactNumber = "+contactNumber+", cardInfo = "+cardInfo+", state = "+state+", credits = "+credits+", companyName = "+companyName+", password = "+password+", userType = "+userType+", country = "+country+", userID = "+userId+", email = "+email+", address = "+address+", profilePic = "+profilePic+", firstName = "+firstName+"]";
    }

}
