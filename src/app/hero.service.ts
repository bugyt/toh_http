import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HeroService {
    private heroesUrl = 'http://62.210.113.108:1337/parse/classes/heroes'; // URL to web api
    private heroesAggUrl = 'http://62.210.113.108:1337/parse/aggregate/heroes'; // URL to aggregate api
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': 'myAppId',
            'X-Parse-Master-Key': 'MASTER_KEY'
        })
    };

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        console.log('HeroService');
    }

    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    /** GET heroes from the server */
    getHeroes(): Observable<Hero[]> {
        return this.http.get(this.heroesUrl, this.httpOptions).pipe(
            map(response => response['results']),
            tap(heroes => this.log('fetched heroes')),
            catchError(this.handleError('getHeroes', []))
        );
    }

    /** GET hero by id. Will 404 if id not found */
    getHero(id: number): Observable<Hero> {
        const whereQuery = { id: id };
        const url =
            `${this.heroesUrl}` +
            '?where=' +
            encodeURI(JSON.stringify(whereQuery));

        return this.http.get<Hero>(url, this.httpOptions).pipe(
            map(function(result) {
                console.log(result);
                this.log(result);
                return result['results'][0] as Hero;
            }, this),
            tap(_ => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    /** GET hero max id. */
    getHeroId(): Observable<Object> {
        const totalQuery = { objectId: null, maxId: { $max: '$id' } };
        const url =
            `${this.heroesAggUrl}` +
            '?group=' +
            encodeURI(JSON.stringify(totalQuery));

        return this.http.get<Object>(url, this.httpOptions).pipe(
            map(function(result) {
                this.log(result);
                return result['results'][0];
            }, this),
            tap(_ => this.log(`getHeroId`)),
            catchError(this.handleError<Hero>(`getHeroId`))
        );
    }

    /** PUT: update the hero on the server */
    updateHero(hero: Hero): Observable<any> {
        delete hero['createdAt'];
        delete hero['updatedAt'];
        const url = `${this.heroesUrl}/${hero.objectId}`;
        return this.http.put(url, hero, this.httpOptions).pipe(
            tap(_ => this.log(`updated hero id=${hero.objectId}`)),
            catchError(this.handleError<any>('updateHero'))
        );
    }

    /** POST: add a new hero to the server */
    addHero(hero: Hero): Observable<Hero> {
        return this.http
            .post<Hero>(this.heroesUrl, hero, this.httpOptions)
            .pipe(
                tap((heron: Hero) => this.log(`added hero w/ id=${hero.id}`)),
                catchError(this.handleError<Hero>('addHero'))
            );
    }

    /** DELETE: delete the hero from the server */
    deleteHero(hero: Hero | number): Observable<Hero> {
        const id = typeof hero === 'number' ? hero : hero.objectId;
        const url = `${this.heroesUrl}/${id}`;

        return this.http.delete<Hero>(url, this.httpOptions).pipe(
            tap(_ => this.log(`deleted hero id=${id}`)),
            catchError(this.handleError<Hero>('deleteHero'))
        );
    }

    /* GET heroes whose name contains search term */
    searchHeroes(term: string): Observable<Hero[]> {
        const whereQuery = { name: { $regex: `.*${term}.*`, $options: 'i' } };

        const url =
            `${this.heroesUrl}` +
            '?where=' +
            encodeURI(JSON.stringify(whereQuery));
        console.log(url);
        if (!term.trim()) {
            // if not search term, return empty hero array.
            return of([]);
        }
        return this.http.get<Hero[]>(url, this.httpOptions).pipe(
            map(function(result) {
                console.log(result);
                this.log(result);
                return result['results'] as Hero[];
            }, this),
            tap(_ => this.log(`found heroes matching "${term}"`)),
            catchError(this.handleError<Hero[]>('searchHeroes', []))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
