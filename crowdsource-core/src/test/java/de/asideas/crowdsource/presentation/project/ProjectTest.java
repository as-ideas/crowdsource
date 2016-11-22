package de.asideas.crowdsource.presentation.project;

import de.asideas.crowdsource.domain.model.FinancingRoundEntity;
import de.asideas.crowdsource.domain.model.PledgeEntity;
import de.asideas.crowdsource.domain.model.ProjectEntity;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.shared.LikeStatus;
import de.asideas.crowdsource.presentation.user.ProjectCreator;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

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
        creator.setId(123L);

        activeFinancingRoundEntity = new FinancingRoundEntity();
        activeFinancingRoundEntity.setEndDate(DateTime.now().plusDays(1));
        Project project = new Project();
        projectEntity = new ProjectEntity(project.getTitle(), project.getShortDescription(), project.getDescription(), project.getPledgeGoal(), activeFinancingRoundEntity, creator);
//        projectEntity.addAttachment(new AttachmentValue("test_fileRef", "test_contentType", "test_filename", 17, DateTime.now()));

        user1 = new UserEntity("user1@xyz.com", "firstname", "lastname");
        user1.setId(1L);
        user2 = new UserEntity("user2@xyz.com", "firstname", "lastname");
        user2.setId(2L);

        pledges = new ArrayList<>();
        pledges.add(new PledgeEntity(projectEntity, user1, BigDecimal.valueOf(10), activeFinancingRoundEntity));
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
//        assertThat(res.getAttachments(), is(projectEntity.getAttachments().stream().map(a-> Attachment.asResponseWithoutPayload(a, projectEntity)).collect(Collectors.toList())));
    }

    @Test
    public void constructionWorks_NullSafe() throws Exception {
        Project res = new Project(projectEntity, pledges, user2);
        assertThat(res.getLastModifiedDate(), is(nullValue()));
    }

    @Test
    public void constructionWorks_likeCountInitWithZero() throws Exception {
        Project res = new Project(projectEntity, pledges, user2);
        assertThat(res.getLikeCount(), is(0L));
    }

    @Test
    public void constructionWorks_likeCountInitWithValue() throws Exception {
        final Random random = new Random(Long.MAX_VALUE);
        long value = random.nextLong();
        Project res = new Project(projectEntity, pledges, user2, value, LikeStatus.LIKE);
        assertThat(res.getLikeCount(), is(value));
    }

}