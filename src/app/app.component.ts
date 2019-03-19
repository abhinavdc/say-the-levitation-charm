import { AppService } from './app.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  correctSpell: boolean;
  isRecording: boolean;
  constructor(private appService: AppService) {}
  title = 'say-the-levitation-charm';

  startRecording() {
    this.isRecording = true;
    this.appService.startSpeechRecognition().subscribe(
      spell => {
        console.log(spell);
        if (spell === 'Wingardium Leviosa') {
          console.log('Correct');
          this.correctSpell = true;
          setTimeout(() => {
            this.correctSpell = false;
          }, 8000);
        }
      },
      err => {
        this.isRecording = false;
      }
    );
  }

  test() {
    this.correctSpell = true;
    setTimeout(() => {
      this.correctSpell = false;
    }, 8000)
  }

  stopRecording() {
    this.appService.stopVoiceRecognition();
    this.isRecording = false;
  }

  startStopToggle() {
    this.isRecording ? this.stopRecording() : this.startRecording();
  }
}
