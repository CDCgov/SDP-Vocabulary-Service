import { schema } from 'normalizr';

export const commentSchema = new schema.Array('comments');
export const conceptSystemSchema = new schema.Entity('conceptSystems');
export const conceptSchema = new schema.Entity('concepts');
export const currentUserSchema = new schema.Entity('currentUser');
export const formSchema = new schema.Entity('forms');
export const formsSchema = [ formSchema ];
export const lastSearchSchema = new schema.Entity('lastSearch');
export const notificationSchema = new schema.Array('notifications');
export const publisherSchema = new schema.Entity('publishers');
export const questionTypeSchema = new schema.Entity('questionTypes');
export const questionSchema = new schema.Entity('questions');
export const questionsSchema = [ questionSchema ];
export const responseSetSchema = new schema.Entity('responseSets');
export const responseSetsSchema = [ responseSetSchema ];
export const responseTypeSchema = new schema.Entity('responseTypes');
export const statsSchema = new schema.Entity('stats');
export const surveillanceProgramSchema = new schema.Entity('surveillancePrograms');
export const surveillanceSystemSchema = new schema.Entity('surveillanceSystems');
export const surveySchema = new schema.Entity('surveys');
export const surveysSchema = [ surveySchema ];
export const tutorialStepSchema = new schema.Array('tutorialSteps');
export const searchResultsSchema = new schema.Array({
  responseSets: responseSetsSchema,
  questions: questionsSchema,
  forms: formsSchema,
  surveys: surveysSchema
}, (input, parent, key) => `${input.Type === 'response_set' ? 'responseSet' : input.Type}s`);

responseSetSchema.define({
  parent: responseSetSchema,
  questions: [ questionSchema ]
});

questionSchema.define({
  parent: questionSchema,
  questionType: questionTypeSchema,
  responseSets: [ responseSetSchema ],
  responseType: responseTypeSchema
});

formSchema.define({
   parent: formSchema,
   questions: [ questionSchema ],
   responseSets: [ responseSetSchema ]
});

surveySchema.define({
  questions: [ questionSchema ],
  forms: [ formSchema ],
  parent: surveySchema
});
