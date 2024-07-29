import html2pdf from 'html2pdf.js';

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { switchMap, from, of, Observable, last, mergeMap, map } from 'rxjs';

import { AssessmentProgress } from '@app/model/convs-mgr/micro-app/assessments';
import { AssessmentMicroApp, MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { FrontendEnvironment } from '@app/elements/base/frontend-env';
import { MicroAppManagementService } from '@app/state/convs-mgr/micro-app';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root'
})
export class AssessmentFeedbackPDFService {

  constructor(private _afS$$: AngularFireStorage,
              private _http$: HttpClient, 
              private _microAppService: MicroAppManagementService,
              @Inject('ENVIRONMENT') private _env: FrontendEnvironment,) {

  }
  /** Returns a list of users that have attempted the assessment */
  generateAndUploadPDF(progress: AssessmentProgress, questions: AssessmentQuestion[], app: MicroAppStatus) {
    const fileName = `${progress.title} - ${new Date().toLocaleString()}.pdf`;

    return this._generateFeedbackHTML(progress, questions)
    .pipe(switchMap((resp)=> {
      if(resp.result.success) {
        return from(this._generatePdf(resp.result.feedbackHTML, progress.title))
      } else {
        return of(null)
      }
    }), switchMap((pdf)=> {
          const pdfPath =`orgs/${app.config.orgId}/end-users/${app.endUserId}/assessments/feedback-pdfs/${Date.now()}.pdf`;
          if(pdf) {
            return this.uploadFile(pdf, pdfPath)
          } else {
            return of(null)
          }
        }), switchMap((url)=> {
          if(url) {
            const config = app.config as AssessmentMicroApp;
            config.pdf = {
              url,
              name: fileName
            }

            app.config = config;

            return this._microAppService.updateApp(app);
          } else {
            return of(null)
          }
        }))
  }

  private async _generatePdf(htmlContent: string, title: string) {
    const container = document.getElementById(`draw-feedback`) as HTMLElement;
    container.innerHTML = htmlContent;

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${title} - ${new Date().toLocaleString()}.pdf`,
      image: { type: 'jpeg', quality: 2 },
      html2canvas: {
        scale: 2,
        logging: true,
        dpi: 96,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'cm',
        format: 'A4',
        orientation: 'portrait',
      },
    };

    try {
      const blob = await html2pdf().set(options).from(container).toPdf().output('blob');
      // const blobUrl = URL.createObjectURL(blob);
      container.innerHTML = '';

      return blob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      container.innerHTML = '';
      throw error;
    }
  }

  uploadFile(file: File, filePath: string) {
    const taskRef = this._afS$$.ref(filePath);
    const task = taskRef.put(file);
    return <Observable<string>>task
    .snapshotChanges()
    .pipe(
      last(),
      mergeMap(
        () => {
          return taskRef.getDownloadURL().pipe(
            map((url) => {
              return url;
            })
          );
        }
      )
    );
  }

  private _generateFeedbackHTML(progress: AssessmentProgress, questions: AssessmentQuestion[]) {
    const url = `${this._env.microAppUrl}/getFeedbackHTML`;
    const payload = {progress, questions}

    return this._http$.post<{result: {success: boolean, feedbackHTML: string}}>(url, {data: payload});
  }
}
