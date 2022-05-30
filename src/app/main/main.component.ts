import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AdvertData } from '../_models/advert';
import { UserData } from '../_models/users';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  style: string = "width: 0%;";

  routeParams: Params;
  queryParams: Params;

  userData: UserData;
  advertData: AdvertData;

  token: string = null;

  loading: boolean = true;
  processing: boolean = false;
  startSurvey: boolean = false;
  endSurvey: boolean = false;
  canTake: boolean = true;
  error: boolean = false;
  complete: boolean = false;

  loadingText: string = "Loading...";
  buttonText: string = "Save Response";

  question: string = '';
  questionId: number;

  counter: number = 0;

  answers: object[] = [];

  questionaire = this.fb.group({
    answer: ['', Validators.required],
  });
  
  get answer() { return this.questionaire.get('answer'); }

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiServices: ApiService
  ) {
    this.getRouteParams();
    this.userData = new UserData;
    this.advertData = new AdvertData;
  }

  ngOnInit(): void {
    this.style = "width: 20%;";

    if (this.routeParams['token'] !== undefined) {
      this.token = this.routeParams['token'];
    }

    localStorage.setItem("token",  this.token );
    this.getUser();
  }

  start() {
    this.style = "width: 0%;";
    this.loading = true;
    this.loadingText = "Preparing Survey...";
    (async () => { 
      this.style = "width: 20%;";
      await this.delay(2000);
      this.style = "width: 40%;";
      await this.delay(2000);
      this.style = "width: 60%;";
      await this.delay(2000);
      this.style = "width: 80%;";
      await this.delay(2000);
      this.style = "width: 100%;";
      this.startSurvey = true;
      this.loading = false;
      this.prepareNext();
    })();
  }

  prepareNext() {
    this.question = this.advertData.questions[this.counter].question;
    this.questionId = this.advertData.questions[this.counter].ref;

    if (this.counter >= (this.advertData.questions.length-1)) {
      this.endSurvey = true;
      this.buttonText = "Submit Survey";
    }
    this.counter = this.counter + 1;
    this.questionaire.reset();
  }

  onSubmit() {
    this.processing = true;
    if(this.questionaire.invalid) {
      return;
    }

    var response: object = {
      ref: this.questionId,
      answer: this.questionaire.value.answer
    }

    if (this.counter <= (this.advertData.questions.length-1)) {
      this.prepareNext();
    } else {
      this.counter = this.counter + 1;
    }

    if (this.counter <= (this.advertData.questions.length+1)) {
      this.answers.push(response);
    }

    this.processing = false;
    if (this.counter == (this.advertData.questions.length+1)) {
      this.postResult();
    }
  }

  postResult() {
    this.processing = true;
    this.error = false;
    this.complete = false;
    this.buttonText = "Saving...";
    
    this.apiServices.postAnswers( this.answers ).subscribe(
      data => {
        if (data.success == true) {
          this.complete = true;
          this.startSurvey = false;
        } else {
          this.error = true;
        }
      }
    );
  }

  getUser() {
    this.style = "width: 40%;";
    this.apiServices.getUser().subscribe(
      data => {
        
        this.style = "width: 60%;";

        if (data.success == true) {
          this.userData = data.data;

          this.advert();
        }
      }
    );
  }

  advert() {
    this.style = "width: 80%;";
    this.apiServices.advert().subscribe(
      data => {
        if (data.success == true) {
          this.advertData = data.data;
          this.loading = false;

          if (data.data.pending === false ) {
            this.canTake = false;
          }
        }
        
        this.style = "width: 100%;";
      }
    );
  }
  
  getRouteParams() {
    // Route parameters
    this.activatedRoute.params.subscribe( params => {
        this.routeParams = params;
    });

    // URL query parameters
    this.activatedRoute.queryParams.subscribe( params => {
        this.queryParams = params;
    });
  }

  gohome() {
      window.location.href = "https://SkrinAd.com";
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
