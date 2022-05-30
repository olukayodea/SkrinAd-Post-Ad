import { Error } from './data';

export class User {
    success: true|false;
    error: Error;
    results: string;
    data: UserData;
}

export class UserData {
    lastName: string;
    firstName: string;
}