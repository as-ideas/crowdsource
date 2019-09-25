import React from 'react'
import './ImprintView.scss'

export default class ImprintView extends React.Component {

  render () {
    return (
        <div className='imprintView__container'>
          <div className='imprintView__content'>
            <content-row class="imprint">
              <h2 translate="AS_IMPRINT_HEADLINE">Impressum</h2>
              <h4 translate="AS_IMPRINT_PROVIDER">Anbieter</h4>
              <address translate="AS_IMPRINT_ADDRESS">
                Axel Springer Ideas Engineering GmbH<br/>
                Ein Unternehmen der Axel Springer SE<br/>
                Axel-Springer-Straße 65<br/>
                10888 Berlin
              </address>

              <h4 translate="AS_IMPRINT_CONTACT_HEADLINE">Kontakt</h4>
              <p translate="AS_IMPRINT_CONTACT_P" translate-value-email="<a href='mailto:crowd@asideas.de'>crowd@asideas.de</a>">
                E-Mail: <a href="mailto:crowd@asideas.de">crowd@asideas.de</a><br/>
                Telefon: 030 - 2591 78100<br/>
              </p>

              <h4 translate="AS_IMPRINT_RESPONSIBLE_HEADLINE">Verantwortlich für den Inhalt nach § 6 Abs.2 MDStV</h4>
              <p translate="AS_IMPRINT_RESPONSIBLE_P">
                  Michael Alber<br/>
              COO<br/>
              Axel-Springer-Straße 65<br/>
              10888 Berlin<br/>
              <br/>
              Amtsgericht/ Handelsregister<br/>
              Sitz Berlin, Amtsgericht Charlottenburg, HRB 138466 B<br/>
              USt-IdNr. DE 287499537<br/>
              Geschäftsführer: Samir Fadlallah, Michael Alber<br/>
              </p>
              <br/>
              <h4 translate="AS_IMPRINT_COPYRIGHTS_HEADLINE">Bildrechte</h4>
              <p translate="AS_IMPRINT_COPYRIGHTS_P"></p>
            </content-row>
          </div>
        </div>
    )
  }

}
