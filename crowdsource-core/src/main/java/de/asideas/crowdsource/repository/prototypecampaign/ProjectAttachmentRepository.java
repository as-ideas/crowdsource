package de.asideas.crowdsource.repository.prototypecampaign;

import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;
import de.asideas.crowdsource.domain.model.prototypecampaign.AttachmentValue;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.io.InputStream;


@Component
public class ProjectAttachmentRepository {

    @Autowired
    GridFsOperations gridFsOperations;

    public AttachmentValue storeAttachment(AttachmentValue fileMetadata, InputStream binaryData) {
        GridFSFile res = gridFsOperations.store(binaryData, fileMetadata.getFilename(), fileMetadata.getContentType());
        return new AttachmentValue(res.getId().toString(), res.getContentType(), res.getFilename(), res.getLength(), new DateTime(res.getUploadDate()));
    }

    public InputStream loadAttachment(AttachmentValue attachment) {
        Assert.notNull(attachment.getFileReference(), "AttachmentValue.fileReference must not be null");
        GridFSDBFile res = gridFsOperations.findOne(new Query(Criteria.where("_id").is(attachment.getFileReference())));
        if(res == null){
            return null;
        }
        return res.getInputStream();
    }

    public void deleteAttachment(AttachmentValue attachment) {
        gridFsOperations.delete(new Query(Criteria.where("_id").is(attachment.getFileReference())));
    }
}
