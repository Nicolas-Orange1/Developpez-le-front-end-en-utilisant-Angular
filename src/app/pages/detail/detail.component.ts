import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  country: Olympic | undefined;
  chartOption: any;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}
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

  getChartOptions(participations: Participation[]): any {
    return {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: participations.map(p => p.city)
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

  get totalEntries(): number {
    return this.country ? this.country.participations.length : 0;
  }

  get totalMedals(): number {
    return this.country ? this.country.participations.reduce((acc, p) => acc + p.medalsCount, 0) : 0;
  }

  get totalAthletes(): number {
    return this.country ? this.country.participations.reduce((acc, p) => acc + p.athleteCount, 0) : 0;
  }

  goHome(): void {
    this.router.navigate(['']);
  }
}