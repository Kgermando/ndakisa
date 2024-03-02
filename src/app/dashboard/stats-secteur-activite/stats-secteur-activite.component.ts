import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
    ApexNonAxisChartSeries,
    ApexTooltip,
    ApexLegend,
    ApexStroke,
    ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    labels: any;
    colors: any;
};


@Component({
  selector: 'app-stats-secteur-activite',
  templateUrl: './stats-secteur-activite.component.html',
  styleUrls: ['./stats-secteur-activite.component.scss']
})
export class StatsSecteurActiviteComponent implements OnChanges {
  @Input() secteurActiviteList:any[] = [];
  @Input() isLoading: boolean;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  
  ngOnChanges(changes: SimpleChanges) {
    
    this.getPieSecteurs();
  }

    getPieSecteurs() {
        this.chartOptions = {
            series: this.secteurActiviteList.map((item: any) => parseFloat(item.count)),
            // colors: ["#ee368c", "#757fef"],
            chart: {
                height: 250,
                type: "donut"
            },
            tooltip: {
                y: {
                    formatter: function (val) { 
                        var beneficiaire = "";
                        if(val > 1) {
                            beneficiaire = "Beneficiaires";
                        } else {
                            beneficiaire = "Beneficiaire";
                        }
                        return "" + val + " " + beneficiaire;
                    },
                },
            },
            stroke: {
                width: 1,
                show: true
            },
            legend: {
                offsetY: 0,
                show: false,
                fontSize: "14px",
                position: "bottom",
                horizontalAlign: "center"
            },
            labels: this.secteurActiviteList.map((item: any) => item.name_secteur)
        };
    }
}