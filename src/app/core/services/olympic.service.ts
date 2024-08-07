import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
/**
 * Cette méthode retourne un Observable contenant un Olympic lié avec sont totals de médaille
 * @returns 
 */
  getTotalMedalsByCountry(): Observable<(Olympic & { totalMedals: number })[]> {
    return this.olympics$.pipe(
      map(olympics => olympics.map(olympic => ({
        ...olympic,
        totalMedals: olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)
      })))
    );
  }
  /**
   * Cette méthode permet de récuperer un pays en fonction de sont id en paramètre
   * @param id 
   * @returns 
   */
  getCountryById(id: number): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => olympics.find(olympic => olympic.id === id))
    );
  }


}
