import { Component, OnInit } from '@angular/core';
import {StocksService} from '../stocks.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stocks = [];
  skip = 0;
  graphData = [];
  dataSource;
  closeResult;
  add_Stock = {
    opening : '',
    closing : ''
  };

  constructor(private stockService : StocksService,private modalService: NgbModal) { 
    this.stockService.getData().subscribe(data =>{
      this.getStocks();
      this.getGraphData();
    });
  }

  getStocks() {
    this.stockService.get(this.skip).subscribe((ret: any[])=>{
      if(ret.length == 0)
      {
        if(this.skip !=0)
          this.skip -=30
        return;
      }
      this.stocks = ret;
    })  
  }

  getGraphData() {
    this.stockService.getGraphData().subscribe((res: any[])=>{
      this.graphData = res;
      this.makegraph();
    })  
  }

  makegraph() {
      this.dataSource = {
        'chart': {
          'caption': 'BSE Monthly',
          'subCaption': 'Stocks',
          'xAxisName' : "Month",
          'yAxisName': "Average Price",
          'theme': 'fusion'
        },
        'data': this.graphData.map((d)=>{
          return {
            label : d.month +" "+d._id.year,
            value : d.avgValue.toFixed(2)
          }
        })
      };
  }
  
  postStock(){
    const data = {
      'open': this.add_Stock.opening,
      'close': this.add_Stock.closing
    };
    this.stockService.post(data).subscribe((res: any[])=>{
      this.add_Stock.opening = '';
      this.add_Stock.closing = '';
    })  

  }

  addStockBtn(content)
  {
    this.modalService.open(content, {ariaLabelledBy: 'New Stock'}).result.then((result) => {
      console.log(result)
      if(result == 'Save' && this.add_Stock.opening && this.add_Stock.closing)
      {
        console.log("here")
        this.postStock()
      }
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  next() {
    this.skip += 30;
   this.getStocks();
  }

  previous() {
    if(this.skip == 0)
      return;
    this.skip -= 30;
    this.getStocks()
  }

  ngOnInit(): void {
    this.getStocks();
    this.getGraphData();
  }
}
