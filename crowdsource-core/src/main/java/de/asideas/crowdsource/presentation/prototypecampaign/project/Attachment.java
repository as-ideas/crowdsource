package de.asideas.crowdsource.presentation.prototypecampaign.project;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.asideas.crowdsource.domain.model.prototypecampaign.AttachmentValue;
import de.asideas.crowdsource.domain.model.prototypecampaign.ProjectEntity;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.joda.time.DateTime;

import java.io.InputStream;

/**
 * Client representation of an {@link AttachmentValue}
 */
public class Attachment {

    private String id;
    private String name;
    private Long size;
    private String type;
    private DateTime created;
    private String linkToFile;
    @JsonIgnore
    private transient InputStream payload;

    private Attachment() {
    }

    private Attachment(AttachmentValue attachmentValue, ProjectEntity parentProject) {
        this.created = attachmentValue.getCreated();
        this.id = attachmentValue.getFileReference();
        this.name = attachmentValue.getFilename();
        this.size = attachmentValue.getSize();
        this.type = attachmentValue.getContentType();
        this.linkToFile = attachmentValue.relativeUri(parentProject);
    }


    public static Attachment asCreationCommand(String name, String type, InputStream payload) {
        Attachment res = new Attachment();
        res.name = name;
        res.type = type;
        res.payload = payload;
        return res;
    }

    public static Attachment asLookupByIdCommand(String id) {
        Attachment res = new Attachment();
        res.id = id;
        return res;
    }

    public static Attachment asResponse(AttachmentValue attachmentValue, ProjectEntity parentProject, InputStream payload) {
        final Attachment res = new Attachment(attachmentValue, parentProject);
        res.setPayload(payload);
        return res;
    }

    public static Attachment asResponseWithoutPayload(AttachmentValue attachmentValue, ProjectEntity parentProject) {
        return new Attachment(attachmentValue, parentProject);
    }


    public DateTime getCreated() {
        return created;
    }

    public String getId() {
        return id;
    }

    public String getLinkToFile() {
        return linkToFile;
    }

    public String getName() {
        return name;
    }

    public Long getSize() {
        return size;
    }

    public String getType() {
        return type;
    }

    public InputStream getPayload() {
        return payload;
    }

    private void setCreated(DateTime created) {
        this.created = created;
    }

    private void setId(String id) {
        this.id = id;
    }

    private void setLinkToFile(String linkToFile) {
        this.linkToFile = linkToFile;
    }

    private void setName(String name) {
        this.name = name;
    }

    private void setSize(Long size) {
        this.size = size;
    }

    private void setType(String type) {
        this.type = type;
    }

    public void setPayload(InputStream payload) {
        this.payload = payload;
    }

    @Override
    public boolean equals(Object o) {
        return EqualsBuilder.reflectionEquals(this, o, false);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this, false);
    }

    @Override
    public String toString() {
        return "Attachment{" +
                "created=" + created +
                ", id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", size=" + size +
                ", type='" + type + '\'' +
                ", linkToFile='" + linkToFile + '\'' +
                '}';
    }
}
