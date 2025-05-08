import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterCreationComponent } from "./components/character-creation/character-creation.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CharacterCreationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Autobattler-Simulator';
}
