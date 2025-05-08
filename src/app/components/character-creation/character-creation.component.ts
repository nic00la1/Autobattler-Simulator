import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-creation',
  imports: [FormsModule],
  templateUrl: './character-creation.component.html',
  styleUrl: './character-creation.component.css'
})
export class CharacterCreationComponent {
  characterName: string = '';
  characterClass: string = 'Warrior';

  onSubmit() : void {
    // Handle form submission logic here
    console.log(`Postać stworzona: Imię = ${this.characterName}, Klasa = ${this.characterClass}`);
    // You can add logic here to pass the character data to another component or service
  }
}
