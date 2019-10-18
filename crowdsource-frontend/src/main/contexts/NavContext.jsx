import React from 'react'


const NavContext = React.createContext();

class NavContextProvider extends React.Component {
  constructor() {
    super()
    this.updatePageTitle = this.updatePageTitle.bind(this)
    this.updateBreadcrumb = this.updateBreadcrumb.bind(this)

    this.state = {
      breadcrumb: null,
      pageTitle: 'Crowdsource',
    }
  }

  updatePageTitle(pageTitle) {
    this.setState({
      pageTitle: pageTitle
    })
  }

  /*
    Breadcrumb is of the form [{title: '', url: ''},{title: '', url: ''}]
   */
  updateBreadcrumb(bcArray) {
    this.setState({
      breadcrumb: bcArray
    })
  }

  render() {
    return (
      <NavContext.Provider value={{
        breadcrumb: this.state.breadcrumb,
        pageTitle: this.state.pageTitle,
        updateBreadcrumb: this.updateBreadcrumb,
        updatePageTitle: this.updatePageTitle
      }}>
        {this.props.children}
      </NavContext.Provider>
    )
  }

}

const NavContextConsumer = NavContext.Consumer;

export {NavContextProvider, NavContextConsumer, NavContext}
