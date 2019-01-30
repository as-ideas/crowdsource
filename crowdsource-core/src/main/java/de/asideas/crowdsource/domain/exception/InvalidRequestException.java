package de.asideas.crowdsource.domain.exception;

public class InvalidRequestException extends RuntimeException {

    public InvalidRequestException(String message) {
        super(message);
    }

    public static InvalidRequestException userAlreadyActivated() {
        return new InvalidRequestException("already_activated");
    }

    public static InvalidRequestException activationTokenInvalid() {
        return new InvalidRequestException("activation_token_invalid");
    }

    public static InvalidRequestException pledgeGoalExceeded() {
        return new InvalidRequestException("pledge_goal_exceeded");
    }

    public static InvalidRequestException userBudgetExceeded() {
        return new InvalidRequestException("user_budget_exceeded");
    }

    public static InvalidRequestException reversePledgeExceeded() {
        return new InvalidRequestException("reverse_pledge_exceeded");
    }

    public static InvalidRequestException projectAlreadyFullyPledged() {
        return new InvalidRequestException("project_already_fully_pledged");
    }

    public static InvalidRequestException financingRoundNotPostProcessedYet() {
        return new InvalidRequestException("financinground_not_postprocessed");
    }

    public static InvalidRequestException projectTookNotPartInLastFinancingRond() {
        return new InvalidRequestException("project_not_in_last_financinground");
    }

    public static InvalidRequestException noFinancingRoundCurrentlyActive() {
        return new InvalidRequestException("no_financing_round_currently_active");
    }

    public static InvalidRequestException financingRoundAlreadyStopped() {
        return new InvalidRequestException("financing_round_already_stopped");
    }

    public static InvalidRequestException postRoundBudgetExceeded() {
        return new InvalidRequestException("financing_round_budget_exceeded");
    }

    public static InvalidRequestException projectNotPublished() {
        return new InvalidRequestException("project_not_published");
    }

    public static InvalidRequestException setToDeferredNotPossibleOnRejected() {
        return new InvalidRequestException("set_to_deferred_not_possible_on_rejected");
    }

    public static InvalidRequestException projectAlreadyInFinancingRound() {
        return new InvalidRequestException("project_already_in_financing_round");
    }

    public static InvalidRequestException zeroPledgeNotValid() {
        return new InvalidRequestException("zero_pledge_not_valid");
    }

    public static InvalidRequestException masterdataChangeNotAllowed() {
        return new InvalidRequestException("master_data_change_not_allowed");
    }

    public static InvalidRequestException fileMustNotBeEmpty() {
        return new InvalidRequestException("file_must_not_be_empty");
    }

    public static InvalidRequestException filetypeNotAllowed() {
        return new InvalidRequestException("file_type_not_alloed");
    }

    public static InvalidRequestException campaignNotActive() {
        return new InvalidRequestException("campaign_not_active");
    }

    public static InvalidRequestException voteOnInvalidIdeaStatus() {
        return new InvalidRequestException("idea_status_invalid_for_vote");
    }
}
