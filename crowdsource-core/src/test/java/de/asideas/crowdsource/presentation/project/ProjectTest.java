package de.asideas.crowdsource.presentation.project;

import de.asideas.crowdsource.domain.model.AttachmentValue;
import de.asideas.crowdsource.domain.model.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.PledgeEntity;
import de.asideas.crowdsource.domain.model.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.presentation.Pledge;
import de.asideas.crowdsource.presentation.user.ProjectCreator;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;

public class ProjectTest {

    private List<PledgeEntity> pledges;
    private ProjectEntity projectEntity;
    private UserEntity user1;
    private UserEntity user2;
    private FinancingRoundEntity activeFinancingRoundEntity;

    @Before
    public void setUp() {
        UserEntity creator = new UserEntity();
        creator.setId("id");

        activeFinancingRoundEntity = new FinancingRoundEntity();
        activeFinancingRoundEntity.setEndDate(DateTime.now().plusDays(1));
        Project project = new Project();
        projectEntity = new ProjectEntity(creator, project, activeFinancingRoundEntity);
        projectEntity.addAttachment(new AttachmentValue("test_fileRef", "test_contentType", "test_filename", 17, DateTime.now()));

        user1 = new UserEntity("user1@xyz.com");
        user1.setId("test_id1");
        user2 = new UserEntity("user2@xyz.com");
        user2.setId("test_id2");

        pledges = new ArrayList<>();
        pledges.add(new PledgeEntity(projectEntity, user1, new Pledge(10), activeFinancingRoundEntity));
    }

    @Test
    public void constructionWorks() throws Exception {

        projectEntity.setLastModifiedDate(new DateTime());
        Project res = new Project(projectEntity, pledges, user2);

        assertThat(res.getPledgedAmountByRequestingUser(), is(projectEntity.pledgedAmountOfUser(pledges, user2)));
        assertThat(res.getPledgedAmount(), is(projectEntity.pledgedAmount(pledges)));
        assertThat(res.getStatus(), is(projectEntity.getStatus()));
        assertThat(res.getBackers(), is(projectEntity.countBackers(pledges)));
        assertThat(res.getCreator(), is(new ProjectCreator(projectEntity.getCreator())));
        assertThat(res.getDescription(), is(projectEntity.getDescription()));
        assertThat(res.getId(), is(projectEntity.getId()));
        assertThat(res.getLastModifiedDate().getTime(), is(projectEntity.getLastModifiedDate().toDate().getTime()));
        assertThat(res.getPledgeGoal(), is(projectEntity.getPledgeGoal()));
        assertThat(res.getShortDescription(), is(projectEntity.getDescription()));
        assertThat(res.getTitle(), is(projectEntity.getTitle()));
        assertThat(res.getAttachments(), is(projectEntity.getAttachments().stream().map(a-> Attachment.asResponseWithoutPayload(a, projectEntity)).collect(Collectors.toList())));
    }

    @Test
    public void constructionWorks_NullSafe() throws Exception {
        Project res = new Project(projectEntity, pledges, user2);
        assertThat(res.getLastModifiedDate(), is(nullValue()));
    }

}