package de.asideas.crowdsource.domain.service.financinground;


import de.asideas.crowdsource.domain.model.prototypecampaign.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.PledgeEntity;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.FinancingRound;
import de.asideas.crowdsource.presentation.prototypecampaign.Pledge;
import de.asideas.crowdsource.domain.shared.prototypecampaign.ProjectStatus;
import de.asideas.crowdsource.repository.prototypecampaign.FinancingRoundRepository;
import de.asideas.crowdsource.repository.prototypecampaign.PledgeRepository;
import de.asideas.crowdsource.repository.prototypecampaign.ProjectRepository;
import org.hamcrest.core.Is;
import org.joda.time.DateTime;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class FinancingRoundPostProcessorTest {

    final int EXPECTED_REMAINING_BUDGET_AFTER_ROUND = 44444 + 444444 - ((22222 - 11111) + (222222 - 111111));

    private final static String SOME_EMAIL = "test_email";
    private final static String SOME_FIRST_NAME = "Karl";
    private final static String SOME_LAST_NAME = "Ranseier";

    private ProjectEntity project_0;
    private ProjectEntity project_1;
    private ProjectEntity project_2;
    private ProjectEntity project_3;
    private ProjectEntity project_4;


    private List<ProjectEntity> mockedProjects;

    @InjectMocks
    private FinancingRoundPostProcessor financingRoundPostProcessor;

    @Mock
    private FinancingRoundRepository financingRoundRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private PledgeRepository pledgeRepository;

    @Before
    public void init() {
        reset(financingRoundRepository, projectRepository, pledgeRepository);

        project_0 = projectEntity(new UserEntity(SOME_EMAIL, SOME_FIRST_NAME, SOME_LAST_NAME), "test_projectId_0", "title", 44, "short description", "description", ProjectStatus.DEFERRED, null);
        project_1 = projectEntity(new UserEntity(SOME_EMAIL, SOME_FIRST_NAME, SOME_LAST_NAME), "test_projectId_1", "title", 444, "short description", "description", ProjectStatus.FULLY_PLEDGED, null);
        project_2 = projectEntity(new UserEntity(SOME_EMAIL, SOME_FIRST_NAME, SOME_LAST_NAME), "test_projectId_2", "title", 4444, "short description", "description", ProjectStatus.DEFERRED, null);
        project_3 = projectEntity(new UserEntity(SOME_EMAIL, SOME_FIRST_NAME, SOME_LAST_NAME), "test_projectId_3", "title", 44444, "short description", "description", ProjectStatus.PUBLISHED, null);
        project_4 = projectEntity(new UserEntity(SOME_EMAIL, SOME_FIRST_NAME, SOME_LAST_NAME), "test_projectId_4", "title", 444444, "short description", "description", ProjectStatus.PUBLISHED, null);
        this.mockedProjects = Arrays.asList(project_0, project_1, project_2, project_3, project_4);

        when(financingRoundRepository.save(any(FinancingRoundEntity.class))).then(i -> i.getArguments()[0]);
        when(projectRepository.findByFinancingRound(any(FinancingRoundEntity.class))).thenReturn(mockedProjects);
        when(pledgeRepository.findByFinancingRound(any(FinancingRoundEntity.class)))
                .thenAnswer(inv -> {
                    final FinancingRoundEntity financingRound = inv.getArgumentAt(0, FinancingRoundEntity.class);
                    return Arrays.asList(
                            aPledgeEntity(project_3, financingRound, project_3.getPledgeGoal() / 2),
                            aPledgeEntity(project_3, financingRound, -project_3.getPledgeGoal() / 4),
                            aPledgeEntity(project_4, financingRound, project_4.getPledgeGoal() / 2),
                            aPledgeEntity(project_4, financingRound, -project_4.getPledgeGoal() / 4)
                    );
                });
    }

    @Test
    public void postProcess_succeeds() throws Exception {
        final FinancingRoundEntity terminatedRound = prepareInactiveFinancingRound();
        project_0.setFinancingRound(terminatedRound);
        project_1.setFinancingRound(terminatedRound);
        project_2.setFinancingRound(null);

        final FinancingRoundEntity res = financingRoundPostProcessor.postProcess(terminatedRound);

        verify(projectRepository, atLeastOnce()).findByFinancingRound(any(FinancingRoundEntity.class));
        verify(financingRoundRepository).save(res);
        verify(projectRepository, times(1)).save(any(ProjectEntity.class));
        assertThat(project_0.getStatus(), is(ProjectStatus.PUBLISHED));
        assertThat(project_1.getStatus(), is(ProjectStatus.FULLY_PLEDGED));
        assertThat(project_2.getStatus(), is(ProjectStatus.DEFERRED));
        assertThat(project_3.getStatus(), is(ProjectStatus.PUBLISHED));
        assertThat(res.getPostRoundBudget(), is(EXPECTED_REMAINING_BUDGET_AFTER_ROUND));
        assertThat(terminatedRound.getTerminationPostProcessingDone(), is(true));
    }

    @Test
    public void postProcess_doesNothingOnActiveRound() throws Exception {
        final FinancingRoundEntity activeRound = prepareActiveFinanzingRound();
        project_0.setFinancingRound(activeRound);

        final FinancingRoundEntity res = financingRoundPostProcessor.postProcess(activeRound);

        verify(projectRepository, never()).findByFinancingRound(activeRound);
        verify(projectRepository, never()).save(any(ProjectEntity.class));
        verify(financingRoundRepository, never()).save(any(FinancingRoundEntity.class));
        assertThat(res, is(activeRound));
        assertThat(res.getTerminationPostProcessingDone(), is(false));
    }

    @Test
    public void notifyProjectsOfTerminatedFinancingRound() throws Exception {
        final FinancingRoundEntity terminatedRound = prepareInactiveFinancingRound();
        project_0.setFinancingRound(terminatedRound);
        project_1.setFinancingRound(terminatedRound);
        project_2.setFinancingRound(null);
        project_3.setFinancingRound(terminatedRound);

        financingRoundPostProcessor.notifyProjectsOfTerminatedFinancingRound(terminatedRound);

        verify(projectRepository).findByFinancingRound(eq(terminatedRound));
        verify(projectRepository).save(any(ProjectEntity.class));
        assertThat(project_0.getStatus(), is(ProjectStatus.PUBLISHED));
        assertThat(project_0.getFinancingRound(), is(nullValue()));
        assertThat(project_1.getStatus(), is(ProjectStatus.FULLY_PLEDGED));
        assertThat(project_1.getFinancingRound(), is(terminatedRound));
        assertThat(project_2.getStatus(), is(ProjectStatus.DEFERRED));
        assertThat(project_2.getFinancingRound(), is(nullValue()));
        assertThat(project_3.getStatus(), is(ProjectStatus.PUBLISHED));
        assertThat(project_3.getFinancingRound(), is(terminatedRound));
    }

    @Test
    public void assignUnpledgedBudgetToFinancingRound() throws Exception {
        final FinancingRoundEntity financingRound = prepareInactiveFinancingRound();

        financingRoundPostProcessor.assignUnpledgedBudgetToFinancingRound(financingRound);

        assertThat(financingRound.getPostRoundBudget(), is(EXPECTED_REMAINING_BUDGET_AFTER_ROUND));
    }

    @Test
    public void assignUnpledgedBudgetToFinancingRound_setToZeroInCasePledgeAmountBiggerThanBudget() throws Exception {
        final FinancingRoundEntity financingRound = prepareInactiveFinancingRound();
        financingRound.setBudget(project_3.getPledgeGoal());

        financingRoundPostProcessor.assignUnpledgedBudgetToFinancingRound(financingRound);

        assertThat(financingRound.getPostRoundBudget(), is(0));
    }

    private ProjectEntity projectEntity(UserEntity userEntity, String id, String title, int pledgeGoal, String shortDescription, String description, ProjectStatus status, DateTime lastModifiedDate) {
        ProjectEntity projectEntity = new ProjectEntity();
        projectEntity.setId(id);
        projectEntity.setTitle(title);
        projectEntity.setPledgeGoal(pledgeGoal);
        projectEntity.setShortDescription(shortDescription);
        projectEntity.setDescription(description);
        projectEntity.setCreator(userEntity);
        projectEntity.setStatus(status);
        projectEntity.setLastModifiedDate(lastModifiedDate);
        when(projectRepository.findOne(id)).thenReturn(projectEntity);
        return projectEntity;
    }

    private FinancingRoundEntity prepareActiveFinanzingRound() {
        FinancingRoundEntity res = aFinancingRound(new DateTime().plusDays(1));
        res.setId(UUID.randomUUID().toString());

        when(financingRoundRepository.findActive(any())).thenReturn(res);
        Assert.assertThat(res.active(), Is.is(true));
        return res;
    }

    private FinancingRoundEntity prepareInactiveFinancingRound() {
        FinancingRoundEntity res = aFinancingRound(new DateTime().minusDays(1));

        when(financingRoundRepository.findActive(any())).thenReturn(res);
        Assert.assertThat(res.active(), Is.is(false));
        return res;
    }

    private FinancingRoundEntity aFinancingRound(DateTime endDate) {
        FinancingRound creationCmd = new FinancingRound();
        creationCmd.setEndDate(endDate);
        creationCmd.setBudget(project_3.getPledgeGoal() + project_4.getPledgeGoal());
        FinancingRoundEntity res = FinancingRoundEntity.newFinancingRound(creationCmd, 7);
        res.setStartDate(new DateTime().minusDays(2));
        res.setId("test_finRoundId");
        return res;
    }

    private PledgeEntity aPledgeEntity(ProjectEntity project, FinancingRoundEntity financingRoundy, int pledgeAmount) {
        return new PledgeEntity(project, null, new Pledge(pledgeAmount), financingRoundy);
    }
}