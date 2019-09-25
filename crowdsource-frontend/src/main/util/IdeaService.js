const DEFAULT_PAGE_SIZE = 50;


class IdeaService
{
  constructor() {
    this.currentCampaign = null;
  }

  static get IDEA_STATUS() {
    return {
      PROPOSED: 'PROPOSED',
      REJECTED: 'REJECTED',
      PUBLISHED: 'PUBLISHED'
    }
  }

  getCampaigns() {
    return fetch('/ideas_campaigns',{
      method: 'GET'
    });
  }

  getCampaign(id) {
    return new Promise(function (resolve, reject) {
      this.currentCampaign = null;

      fetch(`/ideas_campaigns/${id}`,{
        method: 'GET'
      })
      .then(
        (response) => function(response) {
          this.currentCampaign = JSON.parse(response.data)
          resolve(this.currentCampaign);
        },
        function (response) {
        reject(response);
      })
    });
  }

  createIdea(campaignId, idea) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas`,{
      method: 'POST',
      body: JSON.stringify(idea)
    })
  }

  updateIdea(campaignId, idea) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas/${idea.id}`,{
      method: 'PUT',
      body: JSON.stringify(idea)
    })
  }

  getOwnIdeas(campaignId) {
    fetch(`/ideas_campaigns/${campaignId}/my_ideas`,{
      method: 'GET'
    })
  }

  getIdeasWithStatus(campaignId, status) {
    fetch(`/ideas_campaigns/${campaignId}/ideas}`,{
      method: 'GET',
      body: JSON.stringify({
        status: status
      })
    })
  }

  getAll(campaignId, _page) {
    var page = _page === undefined ? 0 : _page;

    fetch(`/ideas_campaigns/${campaignId}/ideas`,{
      method: 'GET',
      body: JSON.stringify({
        page: page,
        pageSize: DEFAULT_PAGE_SIZE
      })
    })
  }

  getAlreadyVoted(campaignId, alreadyVoted, page) {
    fetch(`/ideas_campaigns/${campaignId}/ideas/filtered`,{
      method: 'GET',
      body: JSON.stringify({
        alreadyVoted: alreadyVoted,
        page: page,
        pageSize: DEFAULT_PAGE_SIZE
      })
    })
  }

  voteIdea(campaignId, ideaId, voting) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas/${ideaId}/votes`,{
      method: 'PUT',
      body: JSON.stringify({
        ideaId: ideaId,
        vote: voting
      })
    })
  }

  rejectIdea(campaignId, ideaId, message) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas/${ideaId}/rejection`,{
      method: 'PUT',
      body: JSON.stringify({
        rejectionComment: message
      })
    })
  }

  publishIdea(campaignId, ideaId) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas/${ideaId}/approval`,{
      method: 'PUT',
    })
  }
}

export default new IdeaService();