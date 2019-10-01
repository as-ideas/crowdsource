import React from 'react'
import { setupI18n } from "@lingui/core"
import catalogDe from '../locales/de/messages.js'
import catalogEn from '../locales/en/messages.js'


const I18nContext = React.createContext();

class I18nContextProvider extends React.Component {
  constructor() {
    super()
    this.switchLanguage = this.switchLanguage.bind(this)

    let catalogs = {
      de: catalogDe,
      en: catalogEn
    }

    let i18n = setupI18n({
      language: 'de',
      catalogs: catalogs
    });

    this.state = {
      language: 'de',
      catalogs: catalogs,
      i18n: i18n
    }
  }

  switchLanguage(language) {
    this.state.i18n.activate(language);

    this.setState({
      language: language
    })
  }

  render () {
    return (
      <I18nContext.Provider value={{
        language: this.state.language,
        i18n: this.state.i18n,
        catalogs: this.state.catalogs,
        switchLanguage: this.switchLanguage
      }}>
        {this.props.children}
      </I18nContext.Provider>
    )
  }

}

const I18nContextConsumer = I18nContext.Consumer;

export { I18nContextProvider, I18nContextConsumer }