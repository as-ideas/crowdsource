package de.asideas.crowdsource.controller.prototypecampaign;

import com.fasterxml.jackson.annotation.JsonView;
import de.asideas.crowdsource.domain.exception.ForbiddenException;
import de.asideas.crowdsource.domain.exception.InvalidRequestException;
import de.asideas.crowdsource.domain.model.prototypecampaign.UserEntity;
import de.asideas.crowdsource.domain.shared.ProjectStatus;
import de.asideas.crowdsource.presentation.prototypecampaign.Pledge;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Attachment;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.presentation.prototypecampaign.project.ProjectStatusUpdate;
import de.asideas.crowdsource.security.Roles;
import de.asideas.crowdsource.service.ProjectService;
import de.asideas.crowdsource.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.InvalidMediaTypeException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import static de.asideas.crowdsource.domain.shared.ProjectStatus.FULLY_PLEDGED;
import static de.asideas.crowdsource.domain.shared.ProjectStatus.PUBLISHED;
import static de.asideas.crowdsource.domain.shared.ProjectStatus.PUBLISHED_DEFERRED;

@RestController
public class ProjectController {

    private static final Logger log = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Value("#{T(org.springframework.http.MediaType).parseMediaTypes('${de.asideas.crowdsource.attachment.allowedmediatypes}')}")
    private List<MediaType> attachmentTypesAllowed;

    @Secured({Roles.ROLE_USER})
    @RequestMapping(value = "/projects", method = RequestMethod.GET)
    @JsonView(Project.ProjectSummaryView.class)
    public List<Project> getProjects(Authentication auth) {
        UserEntity userEntity = userFromAuthentication(auth);

        final List<Project> projects = projectService.getProjects(userEntity);
        // filter projects. only return projects that are published, fully pledged or created by the requesting user (or if requestor is admin)
        return projects.stream().filter(project -> mayViewProjectFilter(project, auth)).collect(Collectors.toList());
    }

    @Secured({Roles.ROLE_USER})
    @RequestMapping(value = "/project/{projectId}", method = RequestMethod.GET)
    public Project getProject(@PathVariable String projectId, Authentication auth) {
        UserEntity userEntity = userFromAuthentication(auth);

        final Project project = projectService.getProject(projectId, userEntity);
        if (!mayViewProjectFilter(project, auth)) {
            throw new ForbiddenException();
        }
        return project;
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/project", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public Project addProject(@RequestBody @Valid Project project, Principal principal) {
        UserEntity userEntity = userByPrincipal(principal);
        return projectService.addProject(project, userEntity);
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/project/{projectId}/pledges", method = RequestMethod.POST)
    public void pledgeProject(@PathVariable String projectId, @RequestBody @Valid Pledge pledge, Principal principal) {
        projectService.pledge(projectId, userByPrincipal(principal), pledge);
    }

    @Secured(Roles.ROLE_ADMIN)
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/project/{projectId}/status", method = RequestMethod.PATCH)
    public Project modifyProjectStatus(@PathVariable("projectId") String projectId, @RequestBody @Valid @NotNull ProjectStatusUpdate newStatus, Principal principal) {
        return projectService.modifyProjectStatus(projectId, newStatus.status, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/project/{projectId}", method = RequestMethod.PUT)
    public Project modifyProjectMasterdata(@PathVariable("projectId") String projectId, @RequestBody @Valid @NotNull Project modifiedProject, Principal principal) {
        return projectService.modifyProjectMasterdata(projectId, modifiedProject, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/projects/{projectId}/likes", method = RequestMethod.POST)
    public void likeProject(@PathVariable("projectId") String projectId, Principal principal) {
        projectService.likeProject(projectId, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/projects/{projectId}/likes", method = RequestMethod.DELETE)
    public void unlikeProject(@PathVariable("projectId") String projectId, Principal principal) {
        projectService.unlikeProject(projectId, userByPrincipal(principal));
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/projects/{projectId}/attachments", method = RequestMethod.POST)
    public Attachment addProjectAttachment(@PathVariable("projectId") String projectId, @RequestParam("file") MultipartFile file, Principal principal) {
        if (file.isEmpty()) {
            throw InvalidRequestException.fileMustNotBeEmpty();
        }
        if (!contentTypeAllowed(file.getContentType())) {
            throw InvalidRequestException.filetypeNotAllowed();
        }

        try ( InputStream inputStream = file.getInputStream() ) {
            Attachment attachment = Attachment.asCreationCommand(file.getOriginalFilename(), file.getContentType(), inputStream);

            return projectService.addProjectAttachment(projectId, attachment, userByPrincipal(principal));

        } catch (IOException e) {
            log.warn("Couldn' process file input, due to stream threw IOException; ProjectId: {}", projectId, e);
            throw new RuntimeException("Internal error, couldn't process file stream", e);
        }
    }

    @Secured({Roles.ROLE_TRUSTED_ANONYMOUS, Roles.ROLE_USER})
    @RequestMapping(value = "/projects/{projectId}/attachments/{fileReference}", method = RequestMethod.GET)
    public ResponseEntity<InputStreamResource> serveProjectAttachment(@PathVariable("projectId") String projectId, @PathVariable("fileReference") String fileReference) throws IOException {
        final Attachment attachment = projectService.loadProjectAttachment(projectId, Attachment.asLookupByIdCommand(fileReference));

        return ResponseEntity.ok()
                .contentLength(attachment.getSize())
                .contentType(MediaType.valueOf(attachment.getType()))
                .body(new InputStreamResource(attachment.getPayload()));
    }

    @Secured(Roles.ROLE_USER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "/projects/{projectId}/attachments/{fileReference}", method = RequestMethod.DELETE)
    public void deleteProjectAttachment(@PathVariable("projectId") String projectId, @PathVariable("fileReference") String fileReference, Principal principal) {
        projectService.deleteProjectAttachment(projectId, Attachment.asLookupByIdCommand(fileReference), userByPrincipal(principal));
    }

    private boolean contentTypeAllowed(String contentType) {
        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(contentType);
        } catch (InvalidMediaTypeException e) {
            log.warn("Couldn't parse media type {}", contentType, e);
            return false;
        }
        for (MediaType el : attachmentTypesAllowed) {
            if (el.includes(mediaType)) {
                return true;
            }
        }
        return false;
    }

    private boolean mayViewProjectFilter(Project project, Authentication auth) {
        // fully pledged and published are always visible
        final ProjectStatus status = project.getStatus();
        if (status == FULLY_PLEDGED || status == PUBLISHED || status == PUBLISHED_DEFERRED) {
            return true;
        }

        if (auth == null) {
            return false;
        }

        // admins may do everything
        for (GrantedAuthority grantedAuthority : auth.getAuthorities()) {
            if (Roles.ROLE_ADMIN.equals(grantedAuthority.getAuthority())) {
                return true;
            }
        }

        // the creator always may see his project
        return project.getCreator().getEmail().equals(auth.getName());
    }

    private UserEntity userByPrincipal(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }

    private UserEntity userFromAuthentication(Authentication auth) {
        UserEntity userEntity = null;

        if (auth != null && auth.isAuthenticated()) {
            if (auth.getAuthorities().contains(new SimpleGrantedAuthority(Roles.ROLE_TRUSTED_ANONYMOUS))) {
                return null;
            }
            userEntity = userService.getUserByEmail(auth.getName());
        }
        return userEntity;
    }
}
