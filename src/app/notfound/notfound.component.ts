import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {
  counter: number = 5;
  surfix: string = "seconds"

  constructor() { }

  ngOnInit(): void {
    this.countDown();
  }


  countDown() {
    var _this = this;
    // Set the date we're counting down to
    var seconds = this.counter;

    // Update the count down every 1 second
    var x = setInterval(function() {
      seconds = Math.floor(seconds - 1);
      // Output the result in an element with id="demo"
      _this.counter = seconds;

      if (seconds < 2) {
        _this.surfix = "second";
      }
        
      // If the count down is over, write some text 
      if (seconds <= 0) {
        clearInterval(x);
        window.location.href = "https://SkrinAd.com";
      }
    }, 1000);
  }

}
