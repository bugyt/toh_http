import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  providers: [HeroService]
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }
  /*
  onKey(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      if (this.add((<HTMLInputElement>event.target).value) {
        (<HTMLInputElement>event.target).value = '';
      }
    }
    console.log((<HTMLInputElement>event.target).value + ' || ' + event.key);
  }
  */
  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => (this.heroes = heroes));
  }

  trackByHeroes(index: number, hero: Hero): string {
    return hero.objectId;
  }

  add(name: string): boolean {
    name = name.trim();
    if (!name) {
      return false;
    }
    this.heroService.getHeroId().subscribe(res => {
      const newId = res ? res['maxId'] + 1 : 1;
      const newHero: Hero = {
        objectId: '',
        id: newId,
        name: name
      };
      this.heroService.addHero(newHero).subscribe(hero => {
        this.heroes.push({ id: newId, name: name, objectId: hero.objectId });
      });
    });
    return true;
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
