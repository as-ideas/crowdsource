package de.asideas.crowdsource.domain.shared.prototypecampaign;

public enum StatisticsTypes {

    SUM_REGISTERED_USER("Neuregistrierungen"),
    SUM_CREATED_PROJECT("Eingereichte Projekte"),;

    private final String displayName;

    StatisticsTypes(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
