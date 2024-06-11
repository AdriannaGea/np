import {
  animate,
  animateChild,
  group,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { flashAnimation } from 'src/app/shared/animations/flash.animation';
import { slideAndFadeAnimation } from 'src/app/shared/animations/slide-and-fade.animation';
import { HttpErrorResponse } from '@angular/common/http';
import { NicePlacesService } from 'src/app/services/nice-places.service';
import { Comment } from '../../models/comments.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@listItem', [stagger(50, [animateChild()])]),
      ]),
    ]),
    trigger('listItem', [
      state(
        'default',
        style({
          transform: 'scale(1)',
          'background-color': 'white',
          'z-index': 1,
        })
      ),
      state(
        'active',
        style({
          transform: 'scale(1.05)',
          'background-color': 'beige',
          'z-index': 2,
        })
      ),
      transition('default => active', [animate('100ms ease-in-out')]),
      transition('active => default', [animate('500ms ease-in-out')]),
      transition('void => *', [
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
          'background-color': 'beige',
        }),
        animate(
          '250ms ease-out',
          style({
            transform: 'translateX(0)',
            opacity: 1,
            'background-color': 'white',
          })
        ),
      ]),
      transition(':enter', [
        query('.comment-text, .comment-date', [
          style({
            opacity: 0,
          }),
        ]),
        useAnimation(slideAndFadeAnimation, {
          params: {
            time: '500ms',
            startColor: 'beige',
          },
        }),
        group([
          useAnimation(flashAnimation, {
            params: {
              time: '250ms',
              flashColor: 'beige',
            },
          }),
          query('.comment-text', [
            animate(
              '250ms',
              style({
                opacity: 1,
              })
            ),
          ]),
          query('.comment-date', [
            animate(
              '500ms',
              style({
                opacity: 1,
              })
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  comments: Comment[] = [];
  @Output() newComment = new EventEmitter<string>();

  commentCtrl!: FormControl;
  animationStates: { [key: number]: 'default' | 'active' } = {};

  constructor(
    private formBuilder: FormBuilder,
    @Inject(NicePlacesService) private nps: NicePlacesService
  ) {}

  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(10),
    ]);
    this.loadComments();
  }

  loadComments(): void {
    if (!this.postId) {
      return;
    }
    this.nps.getComments().subscribe(
      (data: any) => {
        this.comments = data.map((comment: any) => ({
          ...comment,
          // createdDate: comment.createdDate, // Używamy wartości string bez konwersji
        }));
        for (let index in this.comments) {
          this.animationStates[index] = 'default';
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  onLeaveComment() {
    if (this.commentCtrl.invalid) {
      return;
    }
    // const maxId = Math.max(...this.comments.map((comment) => comment.id));
    this.comments.unshift({
      id: 1,
      comment: this.commentCtrl.value,
      userId: 1,
      member_id: 1,
      postId: this.postId,
    });
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }

  onListItemMouseEnter(index: number) {
    this.animationStates[index] = 'active';
  }

  onListItemMouseLeave(index: number) {
    this.animationStates[index] = 'default';
  }

  scrollToBottom() {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }
}
