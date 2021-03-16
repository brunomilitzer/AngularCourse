import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from './post.model';
import { catchError, map} from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string): void {
    const postData: Post = {content, title};

    this.http.post<{ name: string }>('https://angular-7ca2f-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      postData).subscribe(responseData => {
      console.log(responseData);
    }, error => {
      this.error.next(error.message);
    });
  }

  fetchPosts(): Observable<Post[]> {
    return this.http.get<{ [key: string]: Post }>('https://angular-7ca2f-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
      .pipe(map(responseData => {
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
    return this.http.delete('https://angular-7ca2f-default-rtdb.europe-west1.firebasedatabase.app/posts.json');
  }
}
