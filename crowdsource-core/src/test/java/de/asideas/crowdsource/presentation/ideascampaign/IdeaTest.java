package de.asideas.crowdsource.presentation.ideascampaign;

import org.joda.time.DateTime;
import org.junit.Test;

import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.testutil.Fixtures;

import static de.asideas.crowdsource.testutil.Fixtures.givenUserEntity;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;

public class IdeaTest {

    @Test
    public void constructFromEntity_shouldYieldExpectedObject(){

        final IdeaEntity givenIdeaEntity = givenIdeaEntity();
        givenIdeaEntity.setRejectionComment("Haste nicht so toll gemacht.");
        final Idea result = new Idea(givenIdeaEntity);


        assertThat(result.getCreatorName(), is("test_firstname"));
        assertThat(result.getId(), is(givenIdeaEntity.getId()));
        assertThat(result.getTitle(), is(givenIdeaEntity.getTitle()));
        assertThat(result.getPitch(), is(givenIdeaEntity.getPitch()));
        assertThat(result.getCreationDate(), is(givenIdeaEntity.getCreatedDate()));
        assertThat(result.getStatus(), is(givenIdeaEntity.getStatus()));
        assertThat(result.getRejectionComment(), is(givenIdeaEntity.getRejectionComment()));
    }

    private IdeaEntity givenIdeaEntity() {
        final IdeaEntity result = IdeaEntity.createIdeaEntity(new Idea("test_title", "sadasdada"), "test_campaingId", givenUserEntity("test_userId"));
        result.setCreatedDate(DateTime.now());
        return result;
    }

}