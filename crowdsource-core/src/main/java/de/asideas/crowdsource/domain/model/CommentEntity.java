package de.asideas.crowdsource.domain.model;

import lombok.Data;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
public class CommentEntity {

    @Id
    @GeneratedValue
    private Long id;
    private String comment;
    @ManyToOne
    private ProjectEntity project;
    @CreatedDate
    @Type(type="org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    private DateTime createdDate;
    @LastModifiedDate
    @Type(type="org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    private DateTime lastModifiedDate;
    @ManyToOne
    private UserEntity creator;

    public CommentEntity() {
    }

    public CommentEntity(ProjectEntity project, String comment, UserEntity creator) {
        this.project = project;
        this.comment = comment;
        this.creator = creator;
    }
}
