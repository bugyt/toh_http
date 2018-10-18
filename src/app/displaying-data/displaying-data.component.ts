import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';

@Component({
    selector: 'app-displaying-data',
    template: `
    <h1>{{title}}</h1>
    <h2>My favorite hero is: {{myHero.name}}</h2>
    <p>Heroes:</p>
      <ul>
        <li *ngFor="let hero of heroes" >
          {{ hero.name }}

        </li>
      </ul>
      <p *ngIf="heroes.length > 3">There are many heroes!</p>
      <p>The sum of 1 + 1 + {{add}} is {{1 + 1 + add}}</p>
      <input type="number" [(ngModel)]="add" placeholder="name"/>
    `
})
export class DisplayingDataComponent implements OnInit {
    private title: string = 'Tour of Heroes';
    private add: number = 1;
    private heroes: Hero[] = [
        new Hero('', 1, 'Windstorm'),
        new Hero('', 13, 'Bombasto'),
        new Hero('', 15, 'Magneta'),
        new Hero('', 20, 'Tornado')
    ];
    myHero: Hero = this.heroes[0];

    ngOnInit() {}
}
