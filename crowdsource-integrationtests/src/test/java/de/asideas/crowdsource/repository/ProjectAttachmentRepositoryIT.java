package de.asideas.crowdsource.repository;

import de.asideas.crowdsource.config.MongoDBConfig;
import de.asideas.crowdsource.domain.model.prototypecampaign.AttachmentValue;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Date;

import static org.exparity.hamcrest.date.DateMatchers.sameMinute;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = {MongoDBConfig.class, CrowdSourceTestConfig.class})
@IntegrationTest
public class ProjectAttachmentRepositoryIT {

    @Autowired
    ProjectAttachmentRepository projectAttachmentRepository;

    @Test
    public void storeAttachment_storedContentShouldBeLoadable() throws Exception {
        AttachmentValue testFileMeta = givenPlaintextFileMeta("a_testfile_name_storage");
        String plaintextPayload = "I am payload to be saved and read";
        InputStream testFileBinary = givenPlaintextPayload(plaintextPayload);

        AttachmentValue res = projectAttachmentRepository.storeAttachment(testFileMeta, testFileBinary);

        thenCreatedFileMetaIsComplete(testFileMeta, res, plaintextPayload);

        InputStream readPayload = projectAttachmentRepository.loadAttachment(res);
        assertThat(IOUtils.toString(readPayload), is(plaintextPayload));
    }

    @Test
    public void deleteAttachment_FileShouldNotBeReadableAnymoreEventually() throws Exception {
        AttachmentValue testFileMeta = givenPlaintextFileMeta("a_testfile_name_deletion");
        String plaintextPayload = "I am payload to be saved and deleted";
        InputStream testFileBinary = givenPlaintextPayload(plaintextPayload);

        AttachmentValue persisted = projectAttachmentRepository.storeAttachment(testFileMeta, testFileBinary);
        projectAttachmentRepository.deleteAttachment(persisted);

        assertThat(projectAttachmentRepository.loadAttachment(persisted), is(nullValue()));
    }

    private InputStream givenPlaintextPayload(String plaintextPayload) {
        return new ByteArrayInputStream(plaintextPayload.getBytes());
    }

    private AttachmentValue givenPlaintextFileMeta(String filename) {
        return new AttachmentValue(filename, "text/plain");
    }

    private void thenCreatedFileMetaIsComplete(AttachmentValue creationMeta, AttachmentValue actualResult, String originalPayload) {
        assertThat(actualResult.getContentType(), is("text/plain"));
        assertThat(actualResult.getFilename(), is(creationMeta.getFilename()));
        assertThat(actualResult.getCreated().toDate(), sameMinute(new Date()));
        assertThat(actualResult.getFileReference(), is(notNullValue()));
        assertThat(actualResult.getSize(), is((long) originalPayload.getBytes().length));
    }
}
