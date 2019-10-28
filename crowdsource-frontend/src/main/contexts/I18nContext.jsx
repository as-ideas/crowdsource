import React from 'react'
import {setupI18n} from "@lingui/core"
import catalogDe from '../locales/de/messages.js'
import catalogEn from '../locales/en/messages.js'


const CATALOGS = {
  de: catalogDe,
  en: catalogEn
};

const I18nContext = React.createContext();

const i18n = setupI18n({
  language: 'de',
  catalogs: CATALOGS
});

const translate = (key) => {
  return i18n._(key);
};

class I18nContextProvider extends React.Component {
  constructor() {
    super()
    this.switchLanguage = this.switchLanguage.bind(this)

    this.state = {
      language: 'de',
      catalogs: CATALOGS,
      i18n: i18n
    }
  }

  switchLanguage(language) {
    this.state.i18n.activate(language);

    this.setState({
      language: language
    })
  }

  render() {
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

export {I18nContextProvider, I18nContextConsumer, i18n, translate}
