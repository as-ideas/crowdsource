package de.asideas.crowdsource.controller.ideascampaign;

public class Paths {
    public static final String IDEAS = "/ideas_campaigns/{campaignId}/ideas";
    public static final String IDEA = IDEAS + "/{ideaId}";
    public static final String IDEA_VOTES = IDEA + "/votes";
    public static final String IDEA_REJECTION = IDEA + "/rejection";
    public static final String IDEA_APPROVAL = IDEA + "/approval";
    public static final String IDEAS_FILTERED = IDEAS + "/filtered";
    public static final String USERS_IDEAS = "/ideas_campaigns/{campaignId}/my_ideas";
}
