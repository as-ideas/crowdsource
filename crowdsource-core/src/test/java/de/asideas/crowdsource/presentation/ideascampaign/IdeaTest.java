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
        final IdeaOut result = new IdeaOut(givenIdeaEntity);

        assertThat(result.getCreatorName(), is("test_firstname"));
        assertThat(result.getId(), is(givenIdeaEntity.getId()));
        assertThat(result.getContent().getOriginal().getTitle(), is(givenIdeaEntity.getOriginalTitle()));
        assertThat(result.getContent().getOriginal().getPitch(), is(givenIdeaEntity.getOriginalPitch()));
        assertThat(result.getCreationDate(), is(givenIdeaEntity.getCreatedDate()));
        assertThat(result.getStatus(), is(givenIdeaEntity.getStatus()));
        assertThat(result.getRejectionComment(), is(givenIdeaEntity.getRejectionComment()));
    }

    private IdeaEntity givenIdeaEntity() {
        final IdeaEntity result = IdeaEntity.createIdeaEntity(new IdeaIn("test_title", "sadasdada"), "test_campaingId", givenUserEntity("test_userId"));
        result.setCreatedDate(DateTime.now());
        return result;
    }

}