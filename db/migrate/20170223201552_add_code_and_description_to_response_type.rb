class AddCodeAndDescriptionToResponseType < ActiveRecord::Migration[5.0]
  def change
    add_column :response_types, :code, :string
    add_column :response_types, :description, :text
    # update the questions that may have one of these types by changing them to their HL7 equivs
    rs = ResponseType.find_by(name: 'Response Set')
    if rs
      rs.name = 'Choice'
      rs.save
    end

    rs = ResponseType.find_by(name: 'Free Text')
    rs.name = 'text' if rs

    types = [{ code: 'decimal', name: 'Decimal',
               description: 'Answer is a floating point number.' },
             { code: 'integer', name: 'Integer',
               description: 'Answer is an integer.' },
             { code: 'date', name: 'Date',
               description: 'Answer is a date.' },
             { code: 'dateTime', name: 'Date Time',
               description: 'Answer is a date and time.' },
             { code: 'instant', name: 'Instant',
               description: 'Answer is a system timestamp.' },
             { code: 'time', name: 'Time',
               description: 'Answer is a time (hour/minute/second) independent of date.' },
             { code: 'string', name: 'String',
               description: 'Answer is a short (few words to short sentence) free-text entry.' },
             { code: 'text', name: 'Text',
               description: 'Answer is a long (potentially multi-paragraph) free-text entry (still captured as a string).' },
             { code: 'url', name: 'Url',
               description: 'Answer is a url (website, FTP site, etc.).' },
             { code: 'choice', name: 'Choice',
               description: 'Answer is a Coding drawn from a list of options.' },
             { code: 'open-choice', name: 'Open Choice',
               description: 'Answer is a Coding drawn from a list of options or a free-text entry.' },
             { code: 'attachment', name: 'Attachment',
               description: 'Answer is binary content such as a image, PDF, etc.' },
             { code: 'reference', name: 'Reference',
               description: 'Answer is a reference to another resource (practitioner, organization, etc.).' },
             { code: 'quantity', name: 'Quantity',
               description: 'Answer is a combination of a numeric value and unit, potentially with a comparator (<, >, etc.).' }]
    types.each do |type|
      rtype = ResponseType.find_or_create_by(name: type[:name])
      rtype.update!(type)
    end
  end
end
