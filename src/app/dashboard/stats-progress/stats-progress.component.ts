import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexStroke,
    ApexYAxis,
    ApexGrid,
    ApexTitleSubtitle,
    ApexLegend
} from "ng-apexcharts"; 

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    tooltip: any;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    title: ApexTitleSubtitle;
    colors: any;
};

@Component({
  selector: 'app-stats-progress',
  templateUrl: './stats-progress.component.html',
  styleUrls: ['./stats-progress.component.scss']
})
export class StatsProgressComponent implements OnChanges {
    @Input() progressionRemboursementHommeList: any[] = [];
    @Input() progressionRemboursementFemmeList: any[] = [];
    @Input() progressionRemboursementDateList: any[] = [];
    @Input() isLoading: boolean;

    @Input() progressionRemboursementParSexeList: any[] = [];
    

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;  

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
        this.getProgression();
    }

    getProgression() {
        this.chartOptions = {  
            // series: [
            //     {
            //         name: "Homme",
            //         data: this.progressionRemboursementHommeList.map((item: any) => parseFloat(item.montant_payer)),
            //     },
            //     {
            //         name: "Femme",
            //         data: this.progressionRemboursementFemmeList.map((item: any) => parseFloat(item.montant_payer)),
            //     } 
            // ],
            series: [
                {
                    name: "Homme",
                    data: this.progressionRemboursementParSexeList.filter(f => f.sexe == "Homme").map((item: any) => parseFloat(item.montant_payer)),
                },
                {
                    name: "Femme",
                    data: this.progressionRemboursementParSexeList.filter(f => f.sexe == "Femme").map((item: any) => parseFloat(item.montant_payer)),
                }
            ],
            chart: {
                height: 300,
                type: "line",
                toolbar: {
                    show: false,
                }
            },
            colors: ["#757fef", "#ee368c"],
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 3,
                curve: "smooth",
            },
            legend: {
                offsetY: 3,
                position: "top",
                fontSize: "14px",
                horizontalAlign: "center",
                labels: {
                    colors: '#5B5B98',
                },
            },
            yaxis: {
                tickAmount: 4,
                labels: {
                    style: {
                        colors: "#a9a9c8",
                        fontSize: "14px",
                    },
                },
                axisBorder: {
                    show: false,
                },
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                labels: {
                    trim: false,
                    style: {
                        colors: "#a9a9c8",
                        fontSize: "14px",
                    },
                },
                categories: this.progressionRemboursementParSexeList.map((item: any) => item.date),
            },
            tooltip: {
                y: {
                    formatter: function(val:any) {
                        return val + " usd";
                    }
                }
            },
            grid: {
                show: true,
                borderColor: "#EDEFF5",
                strokeDashArray: 5,
            },
        }; 
    }

}