import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Post} from './post.model';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable, Subject, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string): void {
    const postData: Post = {content, title};

    this.http.post<{ name: string }>('https://angular-7ca2f-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      postData,
      {
        observe: 'response',
        responseType: 'json'
      }).subscribe(responseData => {
      console.log(responseData);
    }, error => {
      this.error.next(error.message);
    });
  }

  fetchPosts(): Observable<Post[]> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');

    return this.http.get<{ [key: string]: Post }>('https://angular-7ca2f-default-rtdb.europe-west1.firebasedatabase.app/posts.json', {
      headers: new HttpHeaders({'Custom-Header': 'Hello'}),
      params: searchParams
    })
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({...responseData[key], id: key});
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        }));
  }

  deletePosts(): Observable<any> {
    return this.http.delete('https://angular-7ca2f-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      {
        observe: 'events'
      }
    ).pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Sent) {
        // ...
      }
      if (event.type === HttpEventType.Response) {
        console.log(event.body);
      }
    }));
  }
}
