package de.asideas.crowdsource.domain.model.prototypecampaign;

import de.asideas.crowdsource.presentation.prototypecampaign.Pledge;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class UserEntityTest {

    private UserEntity userEntity;

    @Before
    public void setUp() {
        userEntity = new UserEntity();
        userEntity.setBudget(10);
    }

    @Test
    public void accountPledge() throws Exception {
        userEntity.accountPledge(new Pledge(10));
        assertThat(userEntity.getBudget(), is(0));

    }

    @Test(expected = IllegalArgumentException.class)
    public void accountPledge_exceed() throws Exception {
        userEntity.accountPledge(new Pledge(11));
        assertThat(userEntity.getBudget(), is(10));
    }

    @Test
    public void accountPledge_takeBack() throws Exception {
        userEntity.accountPledge(new Pledge(-11));
        assertThat(userEntity.getBudget(), is(21));
    }
}