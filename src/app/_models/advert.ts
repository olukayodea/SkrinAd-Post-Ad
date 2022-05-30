import { Error } from './data';

export class Advert {
    success: true|false;
    error: Error;
    results: string;
    data: AdvertData;
}

export class AdvertData {
    title: string;
    caption: string;
    code: string;
    questions: questionData[] = [];
    dateTaken: string;
    pending: boolean;
}

export class questionData {
    ref: number;
    question: string;
}