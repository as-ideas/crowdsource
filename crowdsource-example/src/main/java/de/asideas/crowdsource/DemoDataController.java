package de.asideas.crowdsource;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.asideas.crowdsource.domain.model.UserEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaContentI18nMap;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeaEntity;
import de.asideas.crowdsource.domain.model.ideascampaign.IdeasCampaignEntity;
import de.asideas.crowdsource.domain.shared.ideascampaign.IdeaStatus;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaIn;
import de.asideas.crowdsource.presentation.ideascampaign.IdeaOut;
import de.asideas.crowdsource.presentation.ideascampaign.IdeasCampaign;
import de.asideas.crowdsource.repository.UserRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeaRepository;
import de.asideas.crowdsource.repository.ideascampaign.IdeasCampaignRepository;
import de.asideas.crowdsource.service.UserService;
import de.asideas.crowdsource.service.ideascampaign.IdeaService;
import de.asideas.crowdsource.service.ideascampaign.IdeasCampaignService;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;
import java.security.Principal;

import static org.slf4j.LoggerFactory.getLogger;

@RestController
@RequestMapping("/demo")
public class DemoDataController {

    private static final Logger LOG = getLogger(DemoDataController.class);

    @Autowired
    private IdeaService ideaService;

    @Autowired
    private IdeasCampaignService ideasCampaignService;

    @Autowired
    private UserService userService;

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private IdeasCampaignRepository ideasCampaignRepository;

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "", method = RequestMethod.DELETE)
    public void deleteDemoData(Principal principal) throws Exception {
        ideaRepository.delete(ideaRepository.findAll());
        ideasCampaignRepository.delete(ideasCampaignRepository.findAll());
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public void createDemoData() throws Exception {
        try {
            LOG.info("Creating demo data...");
            createIdeaCampaigns();
            createIdeasForCampaign();
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private void createIdeaCampaigns() throws Exception {
        LOG.info("createDemoData");

        InputStream inputStream = getClass()
                .getClassLoader().getResourceAsStream("demo/GET_ideas_campaigns.json");

        ObjectMapper objectMapper = new ObjectMapper();

        IdeasCampaign[] ideaCampaigns = objectMapper.readValue(inputStream, IdeasCampaign[].class);
        for (IdeasCampaign ideaCampaign : ideaCampaigns) {
            ideasCampaignService.createCampaign(ideaCampaign, userByPrincipal());
        }
    }

    private void createIdeasForCampaign() throws Exception {
        IdeasCampaignEntity ideasCampaignEntity = ideasCampaignRepository.findAll().stream().filter((ideasCampaign -> ideasCampaign.getSponsor().equalsIgnoreCase("Corporate Sustainability "))).findFirst().get();
        ideasCampaignEntity.setEndDate(new DateTime().plusDays(5));
        ideasCampaignRepository.save(ideasCampaignEntity);

        String campaignId = ideasCampaignEntity.getId();
        LOG.info("Creating ideas for campaign" + campaignId);

        InputStream inputStream = getClass()
                .getClassLoader().getResourceAsStream("demo/GET_ideas_campaigns_5d15ff4218c37b40b7544f32_ideas.json");

        ObjectMapper objectMapper = new ObjectMapper();

        IdeaOut[] ideas = objectMapper.readValue(inputStream, IdeaOut[].class);
        LOG.info("Creating " + ideas.length + " ideas for campaign...");

        for (IdeaOut idea : ideas) {
            IdeaIn newIdea = new IdeaIn(idea.getContentI18n().getOriginal().getTitle(), idea.getContentI18n().getOriginal().getPitch());
            newIdea.setCreatorName(idea.getCreatorName());
            IdeaOut ideaOut = ideaService.createNewIdea(campaignId, newIdea, userByPrincipal());
        }

        for (IdeaEntity ideaEntity : ideaRepository.findAll()) {
            ideaEntity.setApprovingAdminId(userRepository.findAllAdminUsers().get(0).getId());
            ideaEntity.setStatus(IdeaStatus.PUBLISHED);

            IdeaContentI18nMap contentI18n = ideaEntity.getContentI18n();
            contentI18n.setDe(contentI18n.getOriginal());
            contentI18n.setEn(contentI18n.getOriginal());
            contentI18n.setOriginalLanguage("de");

            ideaRepository.save(ideaEntity);
        }
    }


    private UserEntity userByPrincipal() {
        return userService.getUserByEmail("crowdsource@crowd.source.de");
    }
}
