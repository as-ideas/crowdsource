import React from "react";
import {IDEAS_STATUS} from "../../util/IdeaService";
import {Trans} from '@lingui/macro';


export default class IdeasStatusBar extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    let ideas = this.props.ideas;
    let published = ideas.filter(el => el.status === IDEAS_STATUS.PUBLISHED);
    let proposed = ideas.filter(el => el.status === IDEAS_STATUS.PROPOSED);
    let rejected = ideas.filter(el => el.status === IDEAS_STATUS.REJECTED);

    let approvedCount = published.length;
    let proposedCount = proposed.length;
    let rejectedCount = rejected.length;
    return (
      <ideas-own-statistics>
        <ul className="ideas__ul">
          <li className="ideas__li">
            <span className="ideaslist__pill">{approvedCount}</span>
            <span><Trans id="IDEAS_OWN_STATISTIC_LABEL_IDEAS_APPROVED">Freigegebene Ideen</Trans></span>
          </li>
          <li className="ideas__li">
            <span className="ideaslist__pill">{proposedCount}</span>
            <span><Trans id="IDEAS_OWN_STATISTIC_LABEL_IDEAS_PENDING">Ausstehende Ideen</Trans></span></li>
          <li className="ideas__li">
            <span className="ideaslist__pill">{rejectedCount}</span>
            <span><Trans id="IDEAS_OWN_STATISTIC_LABEL_IDEAS_REJECTED">Abgelehnte Ideen</Trans>n</span></li>
        </ul>
      </ideas-own-statistics>
    )
  };
};
