import { schema } from 'normalizr';

export const commentSchema = new schema.Array('comments');
export const conceptSystemSchema = new schema.Entity('conceptSystems');
export const conceptSchema = new schema.Entity('concepts');
export const currentUserSchema = new schema.Entity('currentUser');
export const sectionSchema = new schema.Entity('sections');
export const sectionSearchSchema = new schema.Entity('sections');
export const sectionsSchema = [ sectionSchema ];
export const sectionsSearchSchema = [ sectionSearchSchema ];
export const lastSearchSchema = new schema.Entity('lastSearch');
export const notificationSchema = new schema.Array('notifications');
export const publisherSchema = new schema.Entity('publishers');
export const categorySchema = new schema.Entity('categories');
export const questionSchema = new schema.Entity('questions');
export const questionSearchSchema = new schema.Entity('questions');
export const questionsSchema = [ questionSchema ];
export const questionsSearchSchema = [ questionSearchSchema ];
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
  questions: questionsSearchSchema,
  sections: sectionsSearchSchema,
  surveys: surveysSchema
}, (input) => `${input.Type === 'response_set' ? 'responseSet' : input.Type}s`);

responseSetSchema.define({
  parent: responseSetSchema,
  questions: [ questionSchema ]
});

questionSchema.define({
  parent: questionSchema,
  category: categorySchema,
  responseSets: [ responseSetSchema ],
  responseType: responseTypeSchema,
  sections: [ sectionSchema ]
});

sectionSchema.define({
  parent: sectionSchema,
  questions: [ questionSchema ],
  responseSets: [ responseSetSchema ],
  surveys: [ surveySchema ]
});

surveySchema.define({
  questions: [ questionSchema ],
  nestedSections: [ sectionSchema ],
  sections: [ sectionSchema ],
  parent: surveySchema
});

questionSearchSchema.define({
  parent: questionSearchSchema,
  category: categorySchema,
  responseSets: [ responseSetSchema ],
  responseType: responseTypeSchema
});

sectionSearchSchema.define({
  parent: sectionSearchSchema
});
