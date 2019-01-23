package de.asideas.crowdsource.domain.model.prototypecampaign;

import org.joda.time.DateTime;
import org.springframework.util.Assert;

/**
 * Represents a file attachment, belonging to a {@link ProjectEntity}
 * It actually stores just meta data, enabling to access binary data from MongoDB over Gridfs.
 */
public class AttachmentValue {

    private String fileReference;
    private String filename;
    private long size;
    private String contentType;
    private DateTime created;

    public AttachmentValue(String fileReference, String contentType, String filename, long size, DateTime created) {
        this.fileReference = fileReference;
        this.contentType = contentType;
        this.filename = filename;
        this.size = size;
        this.created = created;
    }

    public AttachmentValue(String filename, String contentType) {
        this.filename = filename;
        this.contentType = contentType;
    }

    private AttachmentValue() {
    }

    public String relativeUri(ProjectEntity parentProject){
        Assert.notNull(parentProject);
        if(this.fileReference == null){
            throw new IllegalStateException("AttachmentValue has not yet an assigned 'fileReference' id and thus cannot serve its relative uri");
        }
        return "/projects/" + parentProject.getId() + "/attachments/" + fileReference;
    }

    public String getContentType() {
        return contentType;
    }

    public DateTime getCreated() {
        return created;
    }

    public String getFilename() {
        return filename;
    }

    public String getFileReference() {
        return fileReference;
    }

    public long getSize() {
        return size;
    }


    private void setContentType(String contentType) {
        this.contentType = contentType;
    }

    private void setCreated(DateTime created) {
        this.created = created;
    }

    private void setFilename(String filename) {
        this.filename = filename;
    }

    private void setFileReference(String fileReference) {
        this.fileReference = fileReference;
    }

    private void setSize(long size) {
        this.size = size;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AttachmentValue that = (AttachmentValue) o;

        return !(fileReference != null ? !fileReference.equals(that.fileReference) : that.fileReference != null);

    }

    @Override
    public int hashCode() {
        return fileReference != null ? fileReference.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "AttachmentEntity{" +
                "contentType='" + contentType + '\'' +
                ", fileReference='" + fileReference + '\'' +
                ", filename='" + filename + '\'' +
                ", size=" + size +
                ", created=" + created +
                '}';
    }
}
