package com.dt.edge.mec.apps.portal.model;

public class CardInfo {
	private String cardExpiryDate;

    private String cardHolderName;

    private String cardType;

    private String cardNumber;

    public String getCardExpiryDate ()
    {
        return cardExpiryDate;
    }

    public void setCardExpiryDate (String cardExpiryDate)
    {
        this.cardExpiryDate = cardExpiryDate;
    }

    public String getCardHolderName ()
    {
        return cardHolderName;
    }

    public void setCardHolderName (String cardHolderName)
    {
        this.cardHolderName = cardHolderName;
    }

    public String getCardType ()
    {
        return cardType;
    }

    public void setCardType (String cardType)
    {
        this.cardType = cardType;
    }

    public String getCardNumber ()
    {
        return cardNumber;
    }

    public void setCardNumber (String cardNumber)
    {
        this.cardNumber = cardNumber;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [cardExpiryDate = "+cardExpiryDate+", cardHolderName = "+cardHolderName+", cardType = "+cardType+", cardNumber = "+cardNumber+"]";
    }
}
