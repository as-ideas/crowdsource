package de.asideas.crowdsource.testsupport.cucumber;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import de.asideas.crowdsource.presentation.prototypecampaign.project.Project;
import de.asideas.crowdsource.testsupport.CrowdSourceTestConfig;
import de.asideas.crowdsource.testsupport.pageobjects.project.ProjectAttachmentsWidget;
import de.asideas.crowdsource.testsupport.selenium.SeleniumWait;
import de.asideas.crowdsource.testsupport.selenium.WebDriverProvider;
import de.asideas.crowdsource.testsupport.util.CrowdSourceClient;
import de.asideas.crowdsource.testsupport.util.UrlProvider;
import org.openqa.selenium.support.PageFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ContextConfiguration;

import java.io.IOException;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

@ContextConfiguration(classes = CrowdSourceTestConfig.class)
public class ProjectAttachmentsSteps {

    private static final Logger log = LoggerFactory.getLogger(ProjectAttachmentsSteps.class);

    public static final String UPLOAD_FILE_NAME = "uploadSample.jpg";
    public static final String LOCAL_PATH_UPLOAD_FILE = "assets/" + UPLOAD_FILE_NAME;

    @Autowired
    private WebDriverProvider webDriverProvider;

    @Autowired
    private UrlProvider urlProvider;

    @Autowired
    private SeleniumWait wait;


    @Autowired
    private CrowdSourceClient crowdSourceClient;

    @Autowired
    private ProjectDetailSteps projectDetailSteps;

    @Autowired
    private ProjectAttachmentsWidget projectAttachmentsWidget;


    @When("^he selects a file to be uploaded$")
    public void he_selects_a_file_to_be_uploaded() throws IOException {
        String filePath = new ClassPathResource(LOCAL_PATH_UPLOAD_FILE).getFile().getAbsolutePath();
        log.info("Going to select file stored locally in path: " + filePath);
        initAttachmentsWidget().selectFile(filePath);
    }

    @And("^the file information to be uploaded is displayed.*$")
    public void the_file_information_to_be_uploaded_is_displayed() {
        ProjectAttachmentsWidget attachmentsWidget = initAttachmentsWidget();
        assertThat(attachmentsWidget.getFileInfoUploadContent(), containsString(UPLOAD_FILE_NAME));
        assertThat(attachmentsWidget.getFileInfoUploadContent(), containsString("MB"));
    }

    public ProjectAttachmentsWidget initAttachmentsWidget() {
        PageFactory.initElements(webDriverProvider.provideDriver(), projectAttachmentsWidget);
        return projectAttachmentsWidget;
    }

    @And("^he clicks the file upload submit button$")
    public void he_Clicks_The_File_Upload_Submit_Button() throws Throwable {
        ProjectAttachmentsWidget attachmentsWidget = initAttachmentsWidget();
        attachmentsWidget.clickUploadButton();
    }

    @Then("^an upload success message appeared.*$")
    public void an_Upload_Success_Message_Appeared() throws Throwable {
        ProjectAttachmentsWidget attachmentsWidget = initAttachmentsWidget();
        assertThat(attachmentsWidget.uploadSuccessMessageVisible(), is(true));
    }

    @And("^the file selector is '(visible|invisible)'.*$")
    public void the_File_Selector_Is_Visible(String visible) throws Throwable {
        ProjectAttachmentsWidget attachmentsWidget = initAttachmentsWidget();
        boolean expectedVisible = "visible".equalsIgnoreCase(visible);
        assertThat(attachmentsWidget.fileChooserVisibile(), is(expectedVisible));
    }

    @And("^the project has got a file attachment.*$")
    public void the_Project_Has_Got_A_File_Attachment() throws Throwable {
        Project createdProject = projectDetailSteps.getCreatedProject();
        crowdSourceClient.uploadFileAttachmentForProject(createdProject,
                new ClassPathResource(LOCAL_PATH_UPLOAD_FILE));
    }

    @And("^the attachment is visible in the attachments table.*$")
    public void the_Attachment_Is_Visible_In_The_Attachments_Table() throws Throwable {
        ProjectAttachmentsWidget attachmentsWidget = initAttachmentsWidget();
        assertThat(attachmentsWidget.attachmentsTable_FilenameCellOfRow(0), containsString(UPLOAD_FILE_NAME));
        assertThat(attachmentsWidget.attachmentsTable_FilesizeCellOfRow(0), containsString("MB"));
    }

    @And("^there is no attachment table visible.*$")
    public void there_is_no_attachment_table_visible() throws Throwable {
        assertThat(initAttachmentsWidget().attachmentsTableExists(), is(false));
    }


    @And("^there is '(a|no)' '(delete|copy|markdown)' button for the attachment.*$")
    public void there_Is_An_Action_Button_For_The_Attachment(String visible, String buttonType) throws Throwable {
        boolean expVisibility = "a".equals(visible);
        boolean determinedVisibility;
        switch (buttonType) {
            case "delete":
                determinedVisibility = initAttachmentsWidget().attachmentsTable_deleteButtonVisibleInRow(0);
                break;
            case "copy":
                determinedVisibility = initAttachmentsWidget().attachmentsTable_copyLinkButtonVisibleInRow(0);
                break;
            case "markdown":
                determinedVisibility = initAttachmentsWidget().attachmentsTable_copyMarkdownButtonVisibleInRow(0);
                break;
            default:
                throw new IllegalArgumentException("Unknown button type requested: " + buttonType);
        }
        assertThat(determinedVisibility, is(expVisibility));
    }

    @When("^he clicks the file delete button$")
    public void he_Clicks_The_File_Delete_Button() throws Throwable {
        initAttachmentsWidget().clickDeleteButtonInRow(0);
    }
}
