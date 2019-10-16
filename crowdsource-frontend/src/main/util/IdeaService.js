import RequestUtil from "./RequestUtil";

const DEFAULT_PAGE_SIZE = 50;

class IdeaService {
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

  getCurrentCampaign() {
    return this.currentCampaign;
  }

  getCampaigns() {
    return fetch('/ideas_campaigns', {
      method: 'GET'
    }).then(response => {
      return response.json()
    });
  }


  getCampaign(id) {
    return new Promise((resolve, reject) => {
      this.currentCampaign = null;

      fetch(`/ideas_campaigns/${id}`, {
        method: 'GET'
      }).then(response => {
        return response.json()
      }).then((jsonData) => {
        this.currentCampaign = jsonData;
        resolve(this.currentCampaign);
      }).catch(error => {
        reject(error);
      });
    });
  }

  createIdea(campaignId, idea) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas`, {
      method: 'POST',
      body: JSON.stringify(idea)
    }).then(response => {
      return response.json()
    })
  }

  updateIdea(campaignId, idea) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas/${idea.id}`, {
      method: 'PUT',
      body: JSON.stringify(idea)
    }).then(response => {
      return response.json()
    })
  }

  getOwnIdeas(campaignId) {
    return fetch(`/ideas_campaigns/${campaignId}/my_ideas`, {
      method: 'GET'
    }).then(response => {
      return response.json()
    })
  }

  getIdeasWithStatus(campaignId, status) {
    let url = `/ideas_campaigns/${campaignId}/ideas}`;
    let params = {
      status: status
    };
    url = RequestUtil.appendParameterToUrl(url, params);

    return fetch(url, {
      method: 'GET',
    }).then(response => {
      return response.json()
    })
  }

  getAll(campaignId, _page) {
    let url = `/ideas_campaigns/${campaignId}/ideas`;
    let page = _page === undefined ? 0 : _page;
    let params = {
      page: page,
      pageSize: DEFAULT_PAGE_SIZE
    };
    url = RequestUtil.appendParameterToUrl(url, params);


    return fetch(url, {
      method: 'GET',
    }).then(response => {
      return response.json()
    })
  }

  getAlreadyVoted(campaignId, alreadyVoted, page) {
    let url = `/ideas_campaigns/${campaignId}/ideas/filtered`;
    let params = {
      alreadyVoted: alreadyVoted,
      page: page,
      pageSize: DEFAULT_PAGE_SIZE
    };
    url = RequestUtil.appendParameterToUrl(url, params);

    return fetch(url)
      .then(response => {
        return response.json()
      })
  }

  voteIdea(campaignId, ideaId, voting) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas/${ideaId}/votes`, {
      method: 'PUT',
      body: JSON.stringify({
        ideaId: ideaId,
        vote: voting
      })
    }).then(response => {
      return response.json()
    })
  }

  rejectIdea(campaignId, ideaId, message) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas/${ideaId}/rejection`, {
      method: 'PUT',
      body: JSON.stringify({
        rejectionComment: message
      })
    }).then(response => {
      return response.json()
    })
  }

  publishIdea(campaignId, ideaId) {
    return fetch(`/ideas_campaigns/${campaignId}/ideas/${ideaId}/approval`, {
      method: 'PUT',
    }).then(response => {
      return response.json()
    })
  }


}

export default new IdeaService();
