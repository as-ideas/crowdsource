package de.asideas.crowdsource.domain.shared.prototypecampaign;

public enum ProjectStatus {

    // just saved
    PROPOSED("In Freigabe"),
    // accepted by admin
    PUBLISHED("Freigegeben"),
    // rejected by admin
    REJECTED("Abgelehnt"),
    // deferred by admin
    DEFERRED("Zurückgestellt"),
    // by admin
    PUBLISHED_DEFERRED("Freigegeben und zurückgestellt"),
    // fully pledged / all money that is needed
    FULLY_PLEDGED("100% finanziert");

    private final String displayName;

    ProjectStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}