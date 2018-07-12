package com.dt.edge.mec.apps.portal.model;

public class ListOfMicroServices {
	private Microservices[] microservices;

    public Microservices[] getMicroservices ()
    {
        return microservices;
    }

    public void setMicroservices (Microservices[] microservices)
    {
        this.microservices = microservices;
    }

    @Override
    public String toString()
    {
        return "ListOfMicroServices [microservices = "+microservices+"]";
    }
}
