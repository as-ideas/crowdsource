package de.asideas.crowdsource.domain.model;

import lombok.Data;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;

@Data
@Entity
public class CommentEntity {

    @Id
    @GeneratedValue
    private Long id;
    @Column
    private String comment;
    @ManyToOne
    private ProjectEntity project;
    @CreatedDate
    private DateTime createdDate;
    @LastModifiedDate
    private DateTime lastModifiedDate;
    @CreatedBy
    private UserEntity creator;

    public CommentEntity() {
    }

    public CommentEntity(ProjectEntity project, String comment) {
        this.project = project;
        this.comment = comment;
    }
}
