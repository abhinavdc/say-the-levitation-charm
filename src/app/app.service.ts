import { Injectable, NgZone } from '@angular/core';
import { trim } from 'lodash';
import { Observable, Observer } from 'rxjs';

interface IWindow extends Window {
  webkitSpeechRecognition: SpeechRecognition;
  SpeechRecognition: SpeechRecognition;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  speechRecognition: SpeechRecognition;
  timeLeft = 2;
  constructor(private zone: NgZone) {}
  /**
   * Start recording voice to recognize and return the text
   */
  startSpeechRecognition(): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      // tslint:disable-next-line:no-any
      const SpeechRecognition: any =
        (window as IWindow).webkitSpeechRecognition ||
        (window as IWindow).SpeechRecognition;
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-in';
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onresult = speech => {
        let term = '';
        if (speech.results) {
          const result = speech.results[speech.resultIndex];
          const transcript = result[0].transcript;
          if (result.isFinal) {
            if (result[0].confidence > 0.3) {
              term = trim(transcript);
            }
          }
        }
        this.zone.run(() => {
          observer.next(term);
        });
      };

      this.speechRecognition.onerror = error => {
        observer.error(error);
      };

      this.speechRecognition.onend = end => {
        observer.complete();
      };

      this.speechRecognition.start();
    });
  }

  /** Stop recording */
  stopVoiceRecognition() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
}
