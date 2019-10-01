import React from "react";
import './AccordionComponent.scss'

export default class AccordionComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isExtended: false
    }
  }

  toggle() {
    this.setState({
      isExtended: !this.state.isExtended
    })
  }

  render() {
    let title = this.props.title;
    let description = this.props.description;

    return (
      <accordion-item>

        <li className={"accordion-navigation " + (this.state.isExtended ? "accordion-active" : "")}>
          <a onClick={this.toggle.bind(this)}>{this.props.title}</a>
          {
            this.state.isExtended ?
              <div className="content">
                {this.props.children}
              </div> : null
          }
        </li>
      </accordion-item>

    )
  };
};
