import React from 'react'
import ContentContainer from 'atoms/container/ContentContainer'
import styles from './Motivation.module.scss'

class Motivation extends React.Component {
  render () {
    return (
        <div className={styles['container']}>
          <div className={styles['background-visual']} />
          <ContentContainer>
              <div className={styles['content']}>
                  <h1 className="teaser-heading">Deine Innovation startet hier</h1>

                  <div className="teaser-action-bar">
                      <div className="teaser-action-bar__item -side">
                          <h2 className="intro-hero__action-bar__heading">From you</h2>
                          <p className="intro-hero__action-bar__ledge">Seid Teil der Crowd</p>
                      </div>

                      <div className="teaser-action-bar__item -center">
                          <h2 className="intro-hero__action-bar__heading">With you</h2>
                          <p className="intro-hero__action-bar__ledge">Bringt euch ein</p>
                      </div>

                      <div className="teaser-action-bar__item -side">
                          <h2 className="intro-hero__action-bar__heading">For you</h2>
                          <p className="intro-hero__action-bar__ledge">Gestaltet die Zukunft</p>
                      </div>
                  </div>

                  <div className="row intro-hero__teaser">
                      <p className={styles['text']}>Du hast eine neuartige Idee für ein Projekt, doch noch nie den richtigen Moment gehabt darüber zu reden?<br/>
                          Du hast eine Idee, wie du die Atmosphäre im Konzern verbessern möchtest?<br/>
                          Du liebst Technologien und hast das ultimative 2.0 in deinem Kopf?</p>
                      <p className={styles['text']}>Hier ist deine Chance! Endlich kannst du deine Ideen und Vorschläge zu verschiedenen Kampagnen des Konzerns veröffentlichen, bewerten, diskutieren und bei erfolgreichem Abschluss aktiv an der Gestaltung mitwirken. Komm mit Zweiflern und Unterstützern ins Gespräch, diskutiere Vorschläge und Binärcodes, profitiere vom Feedback deiner Kollegen, und erstelle das für dich optimale Projekt. Aber Vorsicht:</p>
                      <p className={styles['text']}>Be creative! Be smart! Be innovative!</p>
                      <p className={styles['text']}>Die Konkurrenz schläft nicht! Sei ganz vorn mit dabei, wenn es heißt:</p>
                      <p className={styles['text']}>Axel Springer - mit uns für die Zukunft</p>
                  </div>
          </div>


          </ContentContainer>
        </div>
    )
  }
}

export default Motivation
