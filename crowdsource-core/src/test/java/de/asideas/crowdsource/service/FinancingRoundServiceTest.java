package de.asideas.crowdsource.service;


import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.exception.ResourceNotFoundException;
import de.asideas.crowdsource.domain.model.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.PledgeEntity;
import de.asideas.crowdsource.domain.model.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.FinancingRound;
import de.asideas.crowdsource.presentation.Pledge;
import de.asideas.crowdsource.domain.service.financinground.FinancingRoundPostProcessor;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.repository.FinancingRoundRepository;
import de.asideas.crowdsource.repository.PledgeRepository;
import de.asideas.crowdsource.repository.ProjectRepository;
import de.asideas.crowdsource.repository.UserRepository;
import org.exparity.hamcrest.date.DateMatchers;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.TaskScheduler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static junit.framework.TestCase.fail;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class FinancingRoundServiceTest {

    private static final String ROUND_ID = "4711";
    public static final int POST_ROUND_BUDGET = 400;
    public static final int ROUND_BUDGET = 1000;

    private final static String USER1_EMAIL = "test1@mail.com";
    private final static String USER1_FIRST_NAME = "Karl";
    private final static String USER1_LAST_NAME = "Ranseier";

    private final static String USER2_EMAIL = "test2@mail.com";
    private final static String USER2_FIRST_NAME = "Gubrush";
    private final static String USER2_LAST_NAME = "Threepwood";

    private DateTime fixedDate;
    private List<FinancingRoundEntity> financingRoundEntities;

    @InjectMocks
    private FinancingRoundService financingRoundService;

    @Mock
    private FinancingRoundRepository financingRoundRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private FinancingRoundPostProcessor financingRoundPostProcessor;

    @Mock
    private TaskScheduler crowdScheduler;

    @Mock
    private PledgeRepository pledgeRepository;

    @Before
    public void init() {

        reset(financingRoundRepository, userRepository, projectRepository);

        financingRoundEntities = new ArrayList<>();
        fixedDate = DateTime.parse("2015-01-10T10:10:10Z");
        financingRoundEntities.add(financingRoundEntity(ROUND_ID, fixedDate.minusDays(100), fixedDate.minusDays(50)));
        financingRoundEntities.add(financingRoundEntity(ROUND_ID + "2", fixedDate.minusDays(40), fixedDate.minusDays(30)));
        when(financingRoundRepository.findAll()).thenReturn(financingRoundEntities);

        when(financingRoundRepository.save(any(FinancingRoundEntity.class))).thenAnswer(invocationOnMock -> {
            FinancingRoundEntity round = (FinancingRoundEntity) invocationOnMock.getArguments()[0];
            round.setId(ROUND_ID);
            return round;
        });
        when(financingRoundPostProcessor.postProcess(any(FinancingRoundEntity.class))).thenAnswer(i -> i.getArguments()[0]);
    }


    @Test
    public void allFinancingRounds() throws Exception {
        final int pledgedAmountAfterTermination = 10;
        financingRoundEntities.get(0).setTerminationPostProcessingDone(true);
        financingRoundEntities.get(1).setTerminationPostProcessingDone(true);
        when(pledgeRepository.findByFinancingRoundAndCreatedDateGreaterThan(financingRoundEntities.get(1), financingRoundEntities.get(1).getEndDate()))
                .thenReturn(Collections.singletonList(aPledgeEntity(financingRoundEntities.get(1), pledgedAmountAfterTermination)));

        final List<FinancingRound> res = financingRoundService.allFinancingRounds();

        verify(financingRoundRepository, times(1)).findAll();
        verify(pledgeRepository, times(2)).findByFinancingRoundAndCreatedDateGreaterThan(any(FinancingRoundEntity.class), any(DateTime.class));

        assertFinancingRoundDto(financingRoundEntities.get(0), res.get(0), POST_ROUND_BUDGET);
        assertFinancingRoundDto(financingRoundEntities.get(1), res.get(1), POST_ROUND_BUDGET - pledgedAmountAfterTermination);
    }

    @Test
    public void currentlyActiveRound() throws Exception {
        final FinancingRoundEntity financingRoundEntity = financingRoundEntity("test_roundId", fixedDate.minusDays(100), fixedDate.minusDays(50));
        when(financingRoundRepository.findActive(any()))
                .thenReturn(financingRoundEntity);

        final FinancingRound res = financingRoundService.currentlyActiveRound();

        assertFinancingRoundDto(financingRoundEntity, res, 0);
        verify(financingRoundRepository, times(1)).findActive(any());

    }

    @Test(expected = ResourceNotFoundException.class)
    public void currentlyActiveRound_ThrowsResournceNotFoundExceptionIfNotFonud() throws Exception {

        when(financingRoundRepository.findActive(any(DateTime.class))).thenReturn(null);

        financingRoundService.currentlyActiveRound();
    }

    @Test
    public void mostRecentRound() throws Exception {
        final FinancingRoundEntity expFinancingRound = financingRoundEntity("test_roundId", DateTime.now().minusDays(2), DateTime.now().minusDays(1));

        ArgumentCaptor<PageRequest> pageRequestCaptor = ArgumentCaptor.forClass(PageRequest.class);
        Page mockedPageAnswer = mock(Page.class);
        when(financingRoundRepository.financingRounds(pageRequestCaptor.capture())).thenReturn(mockedPageAnswer);
        when(mockedPageAnswer.getNumberOfElements()).thenReturn(1);
        when(mockedPageAnswer.getContent()).thenReturn(Collections.singletonList(expFinancingRound));

        final FinancingRound res = financingRoundService.mostRecentRound();


        assertThat(res, is(new FinancingRound(expFinancingRound, null)));
        assertThat(pageRequestCaptor.getValue().getSort().getOrderFor("createdDate"), is(new Sort.Order(Sort.Direction.DESC, "createdDate")));
        assertThat(pageRequestCaptor.getValue().getPageSize(), is(1));
        assertThat(pageRequestCaptor.getValue().getPageNumber(), is(0));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void mostRecentRound_throwsExceptionIfNoFinancingRoundsExist() throws Exception {
        ArgumentCaptor<PageRequest> pageRequestCaptor = ArgumentCaptor.forClass(PageRequest.class);
        Page mockedPageAnswer = mock(Page.class);

        when(financingRoundRepository.financingRounds(pageRequestCaptor.capture())).thenReturn(mockedPageAnswer);
        when(mockedPageAnswer.getNumberOfElements()).thenReturn(0);

        financingRoundService.mostRecentRound();
    }

    @Test
    public void startFinancingRound_succeeds() throws Exception {
        givenTwoUsersInDatabase();

        final FinancingRound financingRoundCreationCmd = financingRound(new DateTime().plusDays(1), 99);
        ProjectEntity proposedProject = project(ProjectStatus.PROPOSED);
        ProjectEntity deferredProject = project(ProjectStatus.DEFERRED);
        ProjectEntity publishedProject = project(ProjectStatus.PUBLISHED);
        ProjectEntity rejectedProject = project(ProjectStatus.REJECTED);
        when(projectRepository.findAll()).thenReturn(Arrays.asList(
                proposedProject, rejectedProject, deferredProject, project(ProjectStatus.FULLY_PLEDGED), publishedProject, project(ProjectStatus.FULLY_PLEDGED)
        ));
        ArgumentCaptor<UserEntity> userEntityCaptor = ArgumentCaptor.forClass(UserEntity.class);
        ArgumentCaptor<ProjectEntity> projectCaptor = ArgumentCaptor.forClass(ProjectEntity.class);
        ArgumentCaptor<FinancingRoundEntity> financingRoundCaptor = ArgumentCaptor.forClass(FinancingRoundEntity.class);

        final FinancingRound res = financingRoundService.startNewFinancingRound(financingRoundCreationCmd);

        assertThat(res.isActive(), is(true));
        assertThat(res.getBudget(), is(99));
        assertThat(res.getEndDate().getMillis(), is(financingRoundCreationCmd.getEndDate().getMillis()));
        assertThat(res.getStartDate().toDate(), DateMatchers.sameMinute(financingRoundCreationCmd.getStartDate().toDate()));
        assertThat(res.getPostRoundBudget(), is(nullValue()));

        verify(financingRoundRepository, times(1)).save(financingRoundCaptor.capture());
        verify(userRepository).findAll();
        verify(userRepository, times(2)).save(userEntityCaptor.capture());
        userEntityCaptor.getAllValues().stream().forEach(u -> assertThat(u.getBudget(), is(financingRoundCaptor.getValue().getBudgetPerUser())));

        verify(projectRepository, times(4)).save(projectCaptor.capture());
        List<ProjectEntity> updatedProjects = projectCaptor.getAllValues();
        assertTrue("Deferred project has been updated", updatedProjects.contains(deferredProject));
        assertTrue("Proposed project has been updated", updatedProjects.contains(proposedProject));
        assertTrue("Published project has been updated", updatedProjects.contains(publishedProject));
        assertTrue("Rejected project has been updated", updatedProjects.contains(rejectedProject));
        updatedProjects.stream().forEach(p -> assertThat(p.getFinancingRound(), is(financingRoundCaptor.getValue())));

        verify(crowdScheduler).schedule(any(Runnable.class), eq(res.getEndDate().toDate()));
    }


    @Test
    public void startFinancingRound_withSomeDeletedUsers_ShouldOnlyUseNotDeletedUsers() throws Exception {
        final FinancingRound financingRoundCreationCmd = financingRound(new DateTime().plusDays(1), 99);
        ProjectEntity publishedProject = project(ProjectStatus.PUBLISHED);
        when(projectRepository.findAll()).thenReturn(Arrays.asList(publishedProject));


        UserEntity user = createUser(USER1_EMAIL, USER2_FIRST_NAME, USER1_LAST_NAME);
        UserEntity deletedUser = createDeletedUser(USER2_EMAIL, USER2_FIRST_NAME, USER2_LAST_NAME);

        givenUsersInDatabase(user, deletedUser);

        final FinancingRound res = financingRoundService.startNewFinancingRound(financingRoundCreationCmd);

        assertEquals(99, user.getBudget());
        assertEquals(0, deletedUser.getBudget());
    }

    @Test
    public void stopFinancingRound() throws Exception {
        final DateTime futureDate = fixedDate.plusDays(5000);
        when(financingRoundRepository.findOne(ROUND_ID)).thenReturn(financingRoundEntity(ROUND_ID, fixedDate.minusDays(100), futureDate));

        FinancingRound res = financingRoundService.stopFinancingRound(ROUND_ID);

        ArgumentCaptor<FinancingRoundEntity> entityCaptor = ArgumentCaptor.forClass(FinancingRoundEntity.class);
        verify(financingRoundRepository, atLeastOnce()).save(entityCaptor.capture());
        verify(financingRoundPostProcessor).postProcess(entityCaptor.getValue());

        assertThat(entityCaptor.getValue().getEndDate(), not(futureDate));
        assertThat(res.isActive(), is(false));
        assertThat(res.getBudget(), is(ROUND_BUDGET));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void stopFinancingRound_missingRoundThrowsResourceNotFoundException() throws Exception {
        String roundId = "1337";
        when(financingRoundRepository.findOne(roundId)).thenReturn(null);
        financingRoundService.stopFinancingRound(roundId);
    }

    @Test
    public void stopFinancingRound_alreadyStoppedThrowsInvalidRequestException() throws Exception {
        String roundId = "1337";
        when(financingRoundRepository.findOne(anyString())).thenReturn(financingRoundEntity(null, fixedDate.minusDays(100), fixedDate.minusDays(50)));
        try {
            financingRoundService.stopFinancingRound(roundId);
            fail("Expected InvalidRequestException did not occur");
        } catch (Exception e) {
            assertTrue("Expected an InvalidRequestException", e instanceof InvalidRequestException);
            assertThat(e.getMessage(), is(InvalidRequestException.financingRoundAlreadyStopped().getMessage()));
            verify(financingRoundRepository, never()).save(any(FinancingRoundEntity.class));
        }
    }

    @Test
    public void schedulePostProcessing() throws Exception {
        final FinancingRoundEntity round = financingRoundEntities.get(0);

        prepareSynchronizedCrowdScheduler();
        when(financingRoundRepository.findOne(round.getId())).thenReturn(round);

        financingRoundService.schedulePostProcessing(round);

        verify(financingRoundRepository).findOne(eq(round.getId()));
        verify(financingRoundPostProcessor).postProcess(round);
    }

    @Test
    public void schedulePostProcessing_doesNothinOnNotExistingEntity() throws Exception {
        final FinancingRoundEntity round = financingRoundEntities.get(0);

        prepareSynchronizedCrowdScheduler();
        when(financingRoundRepository.findOne(round.getId())).thenReturn(null);

        financingRoundService.schedulePostProcessing(round);

        verify(financingRoundRepository).findOne(eq(round.getId()));
        verify(financingRoundPostProcessor, never()).postProcess(round);
    }

    @Test
    public void reschedulePostProcessingOfFinancingRounds() throws Exception {
        ArgumentCaptor<Date> scheduleDateCaptor = ArgumentCaptor.forClass(Date.class);

        financingRoundService.reschedulePostProcessingOfFinancingRounds();

        verify(crowdScheduler, times(financingRoundEntities.size())).schedule(any(Runnable.class), scheduleDateCaptor.capture());

        final List<Date> capturedScheduleDates = scheduleDateCaptor.getAllValues();
        assertThat(capturedScheduleDates.size(), is(financingRoundEntities.size()));
        for (int i = 0; i < capturedScheduleDates.size(); i++) {
            assertTrue("Should have captured actual end dates as scheduler dates", capturedScheduleDates.contains(financingRoundEntities.get(i).getEndDate().toDate()));
        }
    }

    @Test
    public void financingRound_ShouldCallRepositoryOnTerminatedPostProcessedRound() throws Exception {
        final FinancingRoundEntity financingRoundEntity = financingRoundEntity("test_roundId", DateTime.now().minusDays(3), DateTime.now().minusDays(2));
        financingRoundEntity.setTerminationPostProcessingDone(true);

        when(pledgeRepository.findByFinancingRoundAndCreatedDateGreaterThan(any(FinancingRoundEntity.class), any(DateTime.class)))
                .thenReturn(Collections.singletonList(aPledgeEntity(financingRoundEntity, 100)));


        final FinancingRound res = financingRoundService.financingRound(financingRoundEntity);
        assertFinancingRoundDto(financingRoundEntity, res, 300);
    }

    @Test
    public void financingRound_ShouldNotCallRepositoryOnNonTerminatedNonPostProcessedRound() throws Exception {
        final FinancingRoundEntity financingRoundEntity = financingRoundEntity("test_roundId", DateTime.now().minusDays(2), DateTime.now().plusDays(1));
        final FinancingRound res = financingRoundService.financingRound(financingRoundEntity);

        assertFinancingRoundDto(financingRoundEntity, res, 0);

        verify(pledgeRepository, never()).findByFinancingRoundAndCreatedDateGreaterThan(any(FinancingRoundEntity.class), any(DateTime.class));
    }

    private void givenUsersInDatabase(UserEntity... users) {
        when(userRepository.findAll()).thenReturn(Arrays.asList(users));
    }


    private void givenTwoUsersInDatabase() {
        List<UserEntity> userEntities = new ArrayList<>();
        userEntities.add(new UserEntity(USER1_EMAIL, USER1_FIRST_NAME, USER1_LAST_NAME));
        userEntities.add(new UserEntity(USER2_EMAIL, USER2_FIRST_NAME, USER2_LAST_NAME));
        when(userRepository.findAll()).thenReturn(userEntities);
    }

    private void assertFinancingRoundDto(FinancingRoundEntity financingRoundEntity, FinancingRound res, Integer expPostRoundBudgetRemaining) {
        assertThat(res.getBudget(), is(financingRoundEntity.getBudget()));
        assertThat(res.getPostRoundBudget(), is(financingRoundEntity.getPostRoundBudget()));
        assertThat(res.getPostRoundBudgetRemaining(), is(expPostRoundBudgetRemaining));
        assertThat(res.getStartDate(), is(financingRoundEntity.getStartDate()));
        assertThat(res.getEndDate(), is(financingRoundEntity.getEndDate()));
        assertThat(res.isActive(), is(financingRoundEntity.active()));
        assertThat(res.getId(), is(financingRoundEntity.getId()));
    }

    private void prepareSynchronizedCrowdScheduler() {
        when(crowdScheduler.schedule(any(Runnable.class), any(Date.class))).thenAnswer(i -> {
            ((Runnable) i.getArguments()[0]).run();
            return null;
        });
    }

    private FinancingRound financingRound(DateTime end, Integer budget) {
        FinancingRound financingRound = new FinancingRound();
        financingRound.setEndDate(end);
        financingRound.setBudget(budget);
        return financingRound;
    }

    private FinancingRoundEntity financingRoundEntity(String roundId, DateTime start, DateTime end) {
        FinancingRoundEntity res = new FinancingRoundEntity();
        res.setId(roundId);
        res.setStartDate(start);
        res.setEndDate(end);
        res.setBudget(ROUND_BUDGET);
        res.setPostRoundBudget(POST_ROUND_BUDGET);
        return res;
    }

    private ProjectEntity project(ProjectStatus status) {
        ProjectEntity projectEntity = new ProjectEntity();
        projectEntity.setStatus(status);
        projectEntity.setId(UUID.randomUUID().toString());
        return projectEntity;
    }

    private PledgeEntity aPledgeEntity(FinancingRoundEntity financingRoundEntity, int pledgeAmount) {
        final PledgeEntity res = new PledgeEntity(new ProjectEntity(), null, new Pledge(pledgeAmount), financingRoundEntity);
        res.setCreatedDate(DateTime.now());
        return res;
    }

    private UserEntity createDeletedUser(String email, String firstName, String lastName) {
        UserEntity user = createUser(email, firstName, lastName);
        user.setDeleted(true);
        return user;

    }

    private UserEntity createUser(String email, String firstName, String lastName) {
        return new UserEntity(email, firstName, lastName);
    }

}