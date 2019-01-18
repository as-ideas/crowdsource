package de.asideas.crowdsource.repository;

import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;
import de.asideas.crowdsource.domain.model.prototypecampaign.AttachmentValue;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;

import java.io.InputStream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProjectAttachmentRepositoryTest {

    @InjectMocks
    ProjectAttachmentRepository projectAttachmentRepository;

    @Mock
    GridFsOperations gridFsOperations;


    @Before
    public void setUp() throws Exception {
        reset(gridFsOperations);
    }

    @Test
    public void storeFile_shouldInvokeGridFsOps() throws Exception {
        final AttachmentValue attachment = aStoringRequestAttachment();
        final InputStream binaryData = mockedInputStream();
        final AttachmentValue expAttachment = aPersitedAttachment();

        when(gridFsOperations.store(
                eq(binaryData), eq(attachment.getFilename()), eq(attachment.getContentType())))
                .thenReturn(mockedFsDbFileFromAttachmentValue(expAttachment));
        AttachmentValue res = projectAttachmentRepository.storeAttachment(attachment, binaryData);

        assertThat(res, is(expAttachment));
    }

    @Test
    public void loadAttachment_shouldReturnNullWhenQueryReturnsNull() throws Exception {
        when(gridFsOperations.findOne(any(Query.class))).thenReturn(null);

        InputStream res = projectAttachmentRepository.loadAttachment(aPersitedAttachment());

        assertThat(res, is(nullValue()));
    }

    @Test
    public void loadAttachment_shouldQueryByFileReference() throws Exception {
        AttachmentValue attachment = aPersitedAttachment();
        InputStream expRes = mockedInputStream();

        when(gridFsOperations.findOne(eq(new Query(Criteria.where("_id").is(attachment.getFileReference()))))).thenReturn(
                new TestGridFsFile(expRes)
        );
        InputStream res = projectAttachmentRepository.loadAttachment(attachment);

        assertTrue(res == expRes);
    }

    @Test
    public void deleteAttachment_shouldRemoveByFileReference() throws Exception {
        AttachmentValue attachment = aPersitedAttachment();

        projectAttachmentRepository.deleteAttachment(attachment);
        verify(gridFsOperations).delete(eq(new Query(Criteria.where("_id").is(attachment.getFileReference()))));
    }

    private AttachmentValue aPersitedAttachment(){
        return new AttachmentValue("a_fieldRef", "text/plain", "a_filename", 17, DateTime.now());
    }

    private AttachmentValue aStoringRequestAttachment() {
        return new AttachmentValue("test_filename", "text/plain");
    }

    private GridFSFile mockedFsDbFileFromAttachmentValue(AttachmentValue input) {
        return new TestGridFsFile(input.getContentType(), input.getCreated().getMillis(), input.getFilename(), input.getFileReference(), input.getSize());
    }

    private InputStream mockedInputStream(){
        return mock(InputStream.class);
    }


    private static class TestGridFsFile extends GridFSDBFile {
        String id;
        String contentType;
        String filename;
        long length;
        long created;
        InputStream inputStream;

        public TestGridFsFile(String contentType, long created, String filename, String id, long length) {
            this.contentType = contentType;
            this.created = created;
            this.filename = filename;
            this.id = id;
            this.length = length;
        }
        public TestGridFsFile(InputStream inputStream) {
            this.inputStream = inputStream;
        }

        @Override
        public String getContentType() {
            return contentType;
        }

        public long getCreated() {
            return created;
        }

        @Override
        public String getFilename() {
            return filename;
        }

        @Override
        public String getId() {
            return id;
        }

        @Override
        public long getLength() {
            return length;
        }

        @Override
        public InputStream getInputStream() {
            return inputStream;
        }
    }
}