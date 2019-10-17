import React from 'react'


const NavContext = React.createContext();

class NavContextProvider extends React.Component {
  constructor() {
    super()
    this.updatePageTitle = this.updatePageTitle.bind(this)

    this.state = {
      pageTitle: 'Crowdsource',
    }
  }

  updatePageTitle(pageTitle) {
    this.setState({
      pageTitle: pageTitle
    })
  }

  render () {
    return (
      <NavContext.Provider value={{
        pageTitle: this.state.pageTitle,
        updatePageTitle: this.updatePageTitle
      }}>
        {this.props.children}
      </NavContext.Provider>
    )
  }

}

const NavContextConsumer = NavContext.Consumer;

export { NavContextProvider, NavContextConsumer }
