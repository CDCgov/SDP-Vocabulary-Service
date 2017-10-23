json.resourceType 'Questionaire'
json.url api_fhir_questionaire_url(@survey)
json.version @survey.version
json.name @survey.name
json.title @survey.name
json.date @survey.updated_at
json.description @survey.description
json.partial! 'api/fhir/codes', codes: @survey.concepts
json.item do
  json.array! @survey.forms do |form|
    json.linkId form.id
    json.text form.name
    json.type 'group'
    json.item do
      json.array! form.form_questions.each do |fq|
        json.linkId fq.id
        json.text fq.question.content
        json.type fq.question.response_type.code
        json.partial! 'api/fhir/codes', codes: fq.question.concepts
        if fq.response_set
          json.options do
            json.reference api_fhir_valueset_url(fq.response_set)
          end
        end
      end
    end
  end
end
