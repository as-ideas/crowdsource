package de.asideas.crowdsource.domain.model.prototypecampaign;

import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.prototypecampaign.Pledge;
import org.joda.time.DateTime;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class PledgeEntityTest {

    private final static String EMAIL = "usr0@la.de";
    private final static String FIRST_NAME = "Karl";
    private final static String LAST_NAME = "Ranseier";

    @Test
    public void add_bothHavingSameProjectFinancingRoundAndUser() throws Exception {
        UserEntity user = user(EMAIL, FIRST_NAME, LAST_NAME);
        FinancingRoundEntity financingRound = new FinancingRoundEntity();
        ProjectEntity project = new ProjectEntity();

        PledgeEntity p0 = pledgeEntity(7, "test_id0", project, user, financingRound);
        PledgeEntity p1 = pledgeEntity(3, "test_id1", project, user, financingRound);

        PledgeEntity res = p0.add(p1);

        assertThat(res.getAmount(), is(10));
        assertThat(res.getUser(), is(user));
        assertThat(res.getCreatedDate(), is(nullValue()));
        assertThat(res.getId(), is(nullValue()));
        assertThat(res.getLastModifiedDate(), is(nullValue()));
        assertThat(res.getFinancingRound(), is(financingRound));
        assertThat(res.getProject(), is(project));
    }

    @Test
    public void add_bothHavingDifferentProjectFinancingRoundAndUser() throws Exception {
        UserEntity user = user(EMAIL, FIRST_NAME, LAST_NAME);
        FinancingRoundEntity financingRound0 = new FinancingRoundEntity();
        financingRound0.setId("test_id0");
        FinancingRoundEntity financingRound1 = new FinancingRoundEntity();
        financingRound1.setId("test_id1");

        ProjectEntity project0 = new ProjectEntity();
        project0.setId("test_id0");
        ProjectEntity project1 = new ProjectEntity();
        project0.setId("test_id1");

        PledgeEntity p0 = pledgeEntity(7, "test_id0", project0, user, financingRound0);
        PledgeEntity p1 = pledgeEntity(3, "test_id0", project1, user, financingRound1);

        PledgeEntity res = p0.add(p1);

        assertThat(res.getAmount(), is(10));
        assertThat(res.getUser(), is(user));
        assertThat(res.getCreatedDate(), is(nullValue()));
        assertThat(res.getLastModifiedDate(), is(nullValue()));
        assertThat(res.getFinancingRound(), is(nullValue()));
        assertThat(res.getProject(), is(nullValue()));

    }

    @Test
    public void add_otherIsNullShouldReturnThisCopy() throws Exception {
        UserEntity user = user(EMAIL, FIRST_NAME, LAST_NAME);
        FinancingRoundEntity financingRound0 = new FinancingRoundEntity();
        financingRound0.setId("test_id0");
        ProjectEntity project0 = new ProjectEntity();
        PledgeEntity p0 = pledgeEntity(7, "test_id0", project0, user, financingRound0);

        PledgeEntity res = p0.add(null);

        assertThat(res.getAmount(), is(7));
        assertThat(res.getUser(), is(user));
        assertThat(res.getCreatedDate(), is(nullValue()));
        assertThat(res.getLastModifiedDate(), is(nullValue()));
        assertThat(res.getFinancingRound(), is(financingRound0));
        assertThat(res.getProject(), is(project0));
    }

    @Test
    public void add_thisMembersAreNullOthersNotResultShouldContainOthers() throws Exception {
        UserEntity user = user(EMAIL, FIRST_NAME, LAST_NAME);
        FinancingRoundEntity financingRound = new FinancingRoundEntity();
        ProjectEntity project = new ProjectEntity();

        PledgeEntity p0 = pledgeEntity(7, "test_id0", null, null, null);
        PledgeEntity p1 = pledgeEntity(3, "test_id1", project, user, financingRound);

        PledgeEntity res = p0.add(p1);

        assertThat(res.getAmount(), is(10));
        assertThat(res.getUser(), is(user));
        assertThat(res.getCreatedDate(), is(nullValue()));
        assertThat(res.getId(), is(nullValue()));
        assertThat(res.getLastModifiedDate(), is(nullValue()));
        assertThat(res.getFinancingRound(), is(financingRound));
        assertThat(res.getProject(), is(project));
    }

    @Test
    public void add_thisMembersAreNotNullButOthersResultShouldContainNulls() throws Exception {
        UserEntity user = user(EMAIL, FIRST_NAME, LAST_NAME);
        FinancingRoundEntity financingRound = new FinancingRoundEntity();
        ProjectEntity project = new ProjectEntity();

        PledgeEntity p0 = pledgeEntity(3, "test_id0", project, user, financingRound);
        PledgeEntity p1 = pledgeEntity(7, "test_id1", null, null, null);

        PledgeEntity res = p0.add(p1);

        assertThat(res.getAmount(), is(10));
        assertThat(res.getUser(), is(nullValue()));
        assertThat(res.getCreatedDate(), is(nullValue()));
        assertThat(res.getId(), is(nullValue()));
        assertThat(res.getLastModifiedDate(), is(nullValue()));
        assertThat(res.getFinancingRound(), is(nullValue()));
        assertThat(res.getProject(), is(nullValue()));
    }

    @Test
    public void creationTimeComparator_bothNullShouldReturnZero() throws Exception {
        assertThat(new PledgeEntity.CreationTimeComparator().compare(
                null,
                null),
                is(0));
    }

    @Test
    public void creationTimeComparator_O1NullShouldBeSmallerThanO2() throws Exception {
        assertThat(new PledgeEntity.CreationTimeComparator().compare(
                null,
                pledgeEntityFromCreationDate(DateTime.now())),
                is(-1));
    }

    @Test
    public void creationTimeComparator_O2NullShouldBeGreaterThanO1() throws Exception {
        assertThat(new PledgeEntity.CreationTimeComparator().compare(
                pledgeEntityFromCreationDate(DateTime.now()),
                null),
                is(1));
    }

    @Test
    public void creationTimeComparator_O1GreaterThanO2ShouldReturnMinusOne() throws Exception {
        assertThat(new PledgeEntity.CreationTimeComparator().compare(
                pledgeEntityFromCreationDate(DateTime.now()),
                pledgeEntityFromCreationDate(DateTime.now().plusDays(1) )) ,
                is(-1));
    }

    @Test
    public void creationTimeComparator_O2GreaterThanO1ShouldReturnOne() throws Exception {
        assertThat(new PledgeEntity.CreationTimeComparator().compare(
                pledgeEntityFromCreationDate(DateTime.now().plusDays(1) ),
                pledgeEntityFromCreationDate(DateTime.now()) ) ,
                is(1));
    }


    private PledgeEntity pledgeEntityFromCreationDate(DateTime creationDate){
        PledgeEntity res = new PledgeEntity(null, null, new Pledge(17), null);
        res.setCreatedDate(creationDate);
        return res;
    }

    private PledgeEntity pledgeEntity(int amount, String id, ProjectEntity project, UserEntity user, FinancingRoundEntity financingRound) {
        PledgeEntity res = new PledgeEntity();
        res.setAmount(amount);
        res.setFinancingRound(financingRound);
        res.setId(id);
        res.setProject(project);
        if(user != null){
            res.setUser(user);
        }
        return res;
    }

    private UserEntity user(String email, String firstName, String lastName) {
        UserEntity userEntity = new UserEntity(email, firstName, lastName);
        userEntity.setId("id_" + email);
        userEntity.setBudget(0);
        return userEntity;
    }
}