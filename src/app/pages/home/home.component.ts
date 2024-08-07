import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[]> = of([]);
  private subscription: Subscription = new Subscription();

  //Variable diagramme
  public chartOption: any;
  public pieChartData: { name: string; value: number; id: number }[] = [];
  public showLegend = true;
  public colorScheme: { domain: string[] } = { domain: [] };
  public numberOfJOs: number = 0;
  public numberOfCountries: number = 0;



  constructor(private olympicService: OlympicService, 
              private router: Router
  ) {}
  ngOnInit(): void {
    this.subscription.add(
      this.olympicService.getTotalMedalsByCountry().subscribe(data => {
        this.pieChartData = data.map(item => ({
          name: item.country,
          value: item.totalMedals,
          id: item.id
        }));

        this.chartOption = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: 'Total Medals',
              type: 'pie',
              radius: '50%',
              data: this.pieChartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        this.colorScheme.domain = data.map(() => this.getRandomColor());
        this.numberOfCountries = data.length;
        this.numberOfJOs = this.calculateUniqueParticipations(data);
      })
    );
  }
  calculateUniqueParticipations(data: Olympic[]): number {
    const uniqueYears = new Set<number>();
    data.forEach(item => {
      item.participations.forEach((participation: Participation) => {
        uniqueYears.add(participation.year);
      });
    });
    return uniqueYears.size;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChartClick(event: any): void {
    const countryId = event.data.id;
    const selectedCountry = this.pieChartData.find(item => item.id === countryId);
    if (selectedCountry) {
      this.router.navigate(['/detail', selectedCountry.id]);
    }
  }


  // Générer des couleurs aléatoires pour le diagramme
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
