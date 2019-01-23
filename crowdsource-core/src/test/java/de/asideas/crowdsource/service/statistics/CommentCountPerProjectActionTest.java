package de.asideas.crowdsource.service.statistics;

import de.asideas.crowdsource.repository.prototypecampaign.CommentRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Mockito.only;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class CommentCountPerProjectActionTest {

    @InjectMocks
    private CommentCountPerProjectAction instance;

    @Mock
    private CommentRepository commentRepository;

    @Test
    public void getCommentCountPerProjectStatistic_should_call_repository_method() {
        instance.getCommentCountPerProjectStatistic(5);

        verify(commentRepository, only()).countCommentsGroupByProject(5);
    }

}