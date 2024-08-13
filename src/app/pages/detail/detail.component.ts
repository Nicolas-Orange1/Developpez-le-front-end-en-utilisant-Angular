import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { EChartsOption } from 'echarts';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  country: Olympic | undefined;
  chartOption!: EChartsOption;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  /**
   * Récupération du pays en fonction du paramètre récupérer dans l'url afin d'afficher le diagramme du pays souhaité
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const countryId = +id;
      this.olympicService.getCountryById(countryId).subscribe(country => {
        this.country = country;
        if (country) {
          this.chartOption = this.getChartOptions(country.participations);
        }
      });
    }
  }

  /**
   * Cette méthode nous permet de récupérer les différentes informations pour la création du diagramme de la page détail
   * Il récupère pour chaque participation qu'il reçoit la ville ainsi que le nombre de médaille gagner dans la participation
   * @param participations 
   * @returns 
   */
  getChartOptions(participations: Participation[]): EChartsOption {
    return {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: participations.map(p => p.year)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Medals',
          type: 'bar',
          data: participations.map(p => p.medalsCount)
        }
      ]
    };
  }
  // la méthode totalEntries permet de récupérer le nombre de participation d'un pays au JO
  get totalEntries(): number {
    return this.country ? this.country.participations.length : 0;
  }
  // la méthode totalEntries permet de récupérer le nombre total de médailles d'un pays tous JO confondu
  get totalMedals(): number {
    return this.country ? this.country.participations.reduce((acc, p) => acc + p.medalsCount, 0) : 0;
  }
  // la méthode totalAthletes permet de récupérer le nombre d'athletes d'un pays tous JO confondu
  get totalAthletes(): number {
    return this.country ? this.country.participations.reduce((acc, p) => acc + p.athleteCount, 0) : 0;
  }

  goHome(): void {
    this.router.navigate(['']); // nous renvoie vers la page d'accueil de l'application
  }
}