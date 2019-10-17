import React from "react";
import PropTypes from "prop-types";
import Events from "../util/Events";

const OVERLAY_ANIMATION_DURATION = 2500;

export default class Overlay extends React.Component {
  static propTypes = {
    eventId: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {show: false}
  }

  componentDidMount() {
    this.eventEmitter = Events.emitter().addListener(this.props.eventId, this.showOverlay.bind(this))
  }

  componentWillUnmount() {
    this.eventEmitter.remove();
  }

  showOverlay(...args) {
    console.info("showOverlay", args);
    this.setState({show: true});
    window.setTimeout(() => {
      this.setState({show: false});
    }, OVERLAY_ANIMATION_DURATION);
  }

  render() {
    let message = this.props.message;
    let type = this.props.type;

    let classForOverlay = "overlay__container overlay--hidden";
    classForOverlay += (type === 'failure' ? ' overlay--failure' : ' overlay--success');
    classForOverlay += (this.state.show ? " overlay--active" : '');

    return <div className={classForOverlay}>
      <div className="overlay__content">
        <div className="overlay__icon"/>
        <div className={type === 'failure' ? 'overlay__text--failure' : 'overlay__text--success'}>
          {message}
        </div>
      </div>
    </div>
  };
};
