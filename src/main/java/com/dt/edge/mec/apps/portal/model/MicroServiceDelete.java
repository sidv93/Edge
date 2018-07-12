
package com.dt.edge.mec.apps.portal.model;

public class MicroServiceDelete {
    private boolean enable;
    private String microServiceName;
    private String onBoardStatus;

    public MicroServiceDelete() {
    }

    public boolean isEnabled() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }

    public String getOnBoardStatus() {
        return onBoardStatus;
    }

    public void setOnBoardStatus(String onBoardStatus) {
        this.onBoardStatus = onBoardStatus;
    }

    public String getMicroServiceName() {
        return microServiceName;
    }

    public void setMicroServiceName(String microServiceName) {
        this.microServiceName = microServiceName;
    }

}
