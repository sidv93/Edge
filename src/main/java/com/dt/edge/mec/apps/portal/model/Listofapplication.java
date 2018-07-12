package com.dt.edge.mec.apps.portal.model;

public class Listofapplication {
	private Applications[] applications;

    public Applications[] getApplications ()
    {
        return applications;
    }

    public void setApplications (Applications[] applications)
    {
        this.applications = applications;
    }

    @Override
    public String toString()
    {
        return "Listofapplication [applications = "+applications+"]";
    }
}
