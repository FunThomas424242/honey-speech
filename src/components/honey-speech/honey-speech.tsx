import {Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State} from "@stencil/core";
import {Sprachausgabe} from "../../libs/sprachausgabe"
import {Logger} from "../../libs/logger";


@Component({
  tag: "honey-speech",
  styleUrl: "honey-speech.css",
  assetsDirs: ['assets'],
  shadow: true
})
export class HoneySpeech {

  sprachAusgabe: Sprachausgabe;


  /**
   * Host Element
   */
  @Element() hostElement: HTMLElement;

  /**
   * Id des Host Elements, falls nicht verfügbar wird diese generiert
   */
  ident: string;

  /**
   * alt text for a11y
   * default: "Lautsprechersymbol zur Sprachausgabe"
   */
  alttext: string;

  /**
   * title text for a11y = tooltip
   * default: Vorlesen
   */
  titletext: string;

  /**
   * taborder
   */
  taborder: string = "0";

  /**
   * if the toggle button is pressed
   */
  @State() isPressed: boolean = false;


  /**
   * An comma separated list  with ids of DOM elements
   * which inner text should be speech.
   */
  @Prop() textids!: string;

  /**
   * enable console logging
   */
  @Prop() verbose: boolean = false;


  /**
   * icon width
   */
  @Prop() iconwidth: string = "36";

  /**
   * icon height
   */
  @Prop() iconheight: string = "36";

  /**
   * i18n language ident for Web Speech API: de-DE or en or de ...
   */
  @Prop() audiolang: string = "de-DE";

  /**
   * pitch for Web Speech API
   */
  @Prop() audiopitch: number = 1;

  /**
   * rate for Web Speech API
   */
  @Prop() audiorate: number = 1;

  /**
   * volume for Web Speech API
   */
  @Prop() audiovolume: number = 1;

  /**
   * voice name used of Web Speech API
   */
  @Prop() voicename: string = undefined;


  /**
   * Fired if the stimme is speaking.
   */
  @Event({bubbles: true, composed: true}) honeySpeakerStarted: EventEmitter<string>;

  /**
   * Fired if the stimme has finished with speaking.
   */
  @Event({bubbles: true, composed: true}) honeySpeakerFinished: EventEmitter<string>;

  /**
   * Fired if the stimme is paused with speaking.
   */
  @Event({bubbles: true, composed: true}) honeySpeakerPaused: EventEmitter<string>;

  /**
   * Fired if the stimme has failed to speak.
   */
  @Event({bubbles: true, composed: true}) honeySpeakerFailed: EventEmitter<string>;

  public connectedCallback() {
    // States initialisieren
    this.ident = this.hostElement.id ? this.hostElement.id : Math.random().toString(36).substring(7);
    this.titletext = this.hostElement.title ? this.hostElement.title : "Vorlesen";
    this.alttext = this.hostElement["alt"] ? this.hostElement["alt"] : "Lautsprechersymbol zur Sprachausgabe";
    this.taborder = this.hostElement.getAttribute("tabindex") ? (this.hostElement.tabIndex + "") : "0";
    // Properties auswerten
    Logger.toggleLogging(this.verbose);
  }


  public componentWillLoad() {
    this.sprachAusgabe = new Sprachausgabe(
      () => {
        this.honeySpeakerStarted.emit(this.ident);
        this.isPressed=true;
        Logger.debugMessage("Vorlesen gestartet");
      },
      () => {
        this.honeySpeakerFinished.emit(this.ident);
        this.isPressed=false
        Logger.debugMessage("Vorlesen beendet");
      },
      () => {
        this.honeySpeakerPaused.emit(this.ident);
        this.isPressed=false
        Logger.debugMessage("Pause mit Vorlesen");
      },
      (ev): void => {
        this.honeySpeakerFailed.emit(this.ident);
        this.isPressed=false;
        Logger.errorMessage("Fehler beim Vorlesen" + JSON.stringify(ev));
      },
      this.audiolang,
      this.audiopitch,
      this.audiorate,
      this.audiovolume,
      this.voicename
    );
  }


  protected getTexte(): string[] {
    if (this.textids) {
      const refIds: string[] = this.textids.split(",");
      const texte: string[] = [];
      refIds.forEach(elementId => {
          const element: HTMLElement = document.getElementById(elementId);
          if (element) {
            texte.push(element.innerText);
          } else {
            Logger.errorMessage("text to speak not found of DOM element with id " + elementId);
          }
        }
      );
      return texte;
    } else {
      return ["Kein Text vorhanden, daher keine Ausgabe möglich."];
    }
  }

  protected async textVorlesen(text: string) {
    this.isPressed = true;
    await this.sprachAusgabe.textVorlesen(text + " ")
  }

  protected toggleAction() {
    Logger.debugMessage("###TOGGLE TO" + this.isPressed);
    this.isPressed = !this.isPressed;
    if (this.isPressed) {
      const texte: string[] = this.getTexte();
      texte.forEach(async text => {
          this.textVorlesen(text);
        }
      );
    }else{
      this.sprachAusgabe.cancel();
    }
  }

  @Listen('click', {capture: true})
  protected onClick(): void {
    this.toggleAction();
  }

  @Listen('keydown', {capture: true})
  protected onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.toggleAction();
    }
  }


  public render() {
    Logger.debugMessage('##RENDER##');
    return (
      <Host
        title={this.titletext}
        alt={this.alttext}
        role="button"
        tabindex={this.taborder}
        aria-pressed={this.isPressed ? "true" : "false"}
      >
        {this.isPressed ? (
          <svg id={this.ident + "-svg"} xmlns="http://www.w3.org/2000/svg"
               width={this.iconwidth} height={this.iconheight}
               role="img"
               aria-label={this.alttext}
               class="speakerimage"
               viewBox="0 0 75 75">
            <path
              stroke-width="5" stroke-linejoin="round"
              d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z">
            </path>
            <path
              id="air"
              stroke="var(--speaker-color,black);" fill="none" stroke-width="5" stroke-linecap="round"
              d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6">

              <animate id="airanimation" attributeType="CSS" attributeName="opacity" from="1" to="0" dur="1s"
                       repeatCount="indefinite"/>

            </path>
          </svg>
        ) : (
          <svg id={this.ident + "-svg"} xmlns="http://www.w3.org/2000/svg"
               width={this.iconwidth} height={this.iconheight}
               role="img"
               aria-label={this.alttext}
               class="speakerimage"
               viewBox="0 0 75 75">
            <path
              stroke-width="5" stroke-linejoin="round"
              d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z">
            </path>
            <path
              id="air"
              stroke="var(--speaker-color,black);" fill="none" stroke-width="5" stroke-linecap="round"
              d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6">
            </path>
          </svg>
        )}
      </Host>
    );
  }
}
